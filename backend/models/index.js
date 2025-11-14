const db = require('../config/db');

// Minimal model shim to provide the methods controllers expect.
// This avoids requiring a full ORM setup and uses the existing `db.query`.

// helper: cache table columns to avoid trying to update non-existent columns
const _tableColumnsCache = {};
const getTableColumns = async (tableName) => {
    if (_tableColumnsCache[tableName]) return _tableColumnsCache[tableName];
    const res = await db.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [tableName]);
    const cols = res.rows.map((r) => r.column_name);
    _tableColumnsCache[tableName] = new Set(cols);
    return _tableColumnsCache[tableName];
};

const User = {
    findByPk: async (id, options = {}) => {
        if (!id) return null;
        const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        const row = res.rows[0];
        if (!row) return null;

        // remove excluded attributes if requested
        if (options.attributes && options.attributes.exclude) {
            for (const attr of options.attributes.exclude) {
                if (row.hasOwnProperty(attr)) delete row[attr];
            }
        }

        // handle include of Patient model (simple single relationship)
        if (options.include && Array.isArray(options.include)) {
            const wantsPatient = options.include.some((inc) => inc && inc.model && inc.model === 'Patient' || inc.model === 'Patient');
            // Also accept include: [{ model: Patient }] where Patient might be the object; in that case we still fetch by user_id
            if (wantsPatient || options.include.length > 0) {
                // fetch patient row for this user
                const p = await db.query('SELECT * FROM patients WHERE user_id = $1', [id]);
                // attach as `Patient` to mirror a simplified Sequelize include
                row.Patient = p.rows[0] || null;
            }
        }

        return row;
    },

    update: async (values = {}, opts = {}) => {
        const where = opts.where || {};
        const id = where.id;
        if (!id) throw new Error('User.update requires where.id');

        const tableCols = await getTableColumns('users');

        const fields = Object.keys(values).filter((k) => values[k] !== undefined && tableCols.has(k));
        if (fields.length === 0) {
            // nothing to update (either no values or none match table columns)
            return;
        }

        const sets = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        // prepare params with special handling for JSON/JSONB fields
        const params = fields.map((f) => {
            const val = values[f];
            if (f === 'encrypted_fields' && val !== undefined && typeof val === 'object') {
                // send as JSON string so pg can bind it to a JSONB column
                try {
                    return JSON.stringify(val);
                } catch (e) {
                    return val;
                }
            }
            return val;
        });
        params.push(id);

        await db.query(`UPDATE users SET ${sets} WHERE id = $${params.length}`, params);
    }
};

const Patient = {
    update: async (values = {}, opts = {}) => {
        const where = opts.where || {};
        // support where.user_id
        const userId = where.user_id || where.userId;
        if (!userId) throw new Error('Patient.update requires where.user_id');

        const tableCols = await getTableColumns('patients');

        const fields = Object.keys(values).filter((k) => values[k] !== undefined && tableCols.has(k));
        if (fields.length === 0) return;

        const sets = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const params = fields.map((f) => values[f]);
        params.push(userId);

        await db.query(`UPDATE patients SET ${sets} WHERE user_id = $${params.length}`, params);
    }
};

module.exports = {
    User,
    Patient
};

