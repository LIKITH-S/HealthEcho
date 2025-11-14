// import { useNavigate } from 'react-router-dom';
// import chatbotIcon from '../../assets/chatbot-icon.svg'; // Adjust path as needed

// export default function ChatbotToggle() {
//     const navigate = useNavigate();

//     return (
//         <button
//             aria-label="Open chatbot"
//             onClick={() => navigate('/chatbot')}
//             className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             style={{ background: 'transparent', width: '50px', height: '50px' }} // example size for large icon
//         >
//             <img
//                 src={chatbotIcon}
//                 alt="Chatbot Icon"
//                 className="object-contain"
//                 style={{ width: '80px', height: '80px', background: 'transparent' }}
//             />
//         </button>
//     );
// }
import { useNavigate } from 'react-router-dom';
import chatbotIcon from '../../assets/chatbot-icon.svg'; // Adjust path as needed

export default function ChatbotToggle() {
    const navigate = useNavigate();

    return (
        <button
            aria-label="Open chatbot"
            onClick={() => navigate('/chatbot')}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-300 shadow-md"
            style={{ background: 'transparent', width: '70px', height: '70px' }} // smaller size for a tighter button
        >
            <img
                src={chatbotIcon}
                alt="Chatbot Icon"
                className="object-contain"
                style={{ width: '60px', height: '60px', background: 'transparent' }}
            />
        </button>
    );
}
