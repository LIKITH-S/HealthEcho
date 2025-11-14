from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


class ActionMedicationLookup(Action):
    def name(self) -> Text:
        return "action_medication_lookup"

    def run(self, dispatcher, tracker, domain):
        med = tracker.get_slot("medication")

        if not med:
            dispatcher.utter_message(text="Please tell me the medication name.")
            return []

        data = {
            "aspirin": "Side effects include nausea, stomach pain, bleeding risk.",
            "paracetamol": "Side effects include nausea, rash, and liver damage if overdosed.",
            "ibuprofen": "Side effects include stomach pain, dizziness, and bleeding."
        }

        med = med.lower()
        if med in data:
            dispatcher.utter_message(text=data[med])
        else:
            dispatcher.utter_message(text=f"I don't have information about {med}.")
        return []


class ActionSymptomChecker(Action):
    def name(self) -> Text:
        return "action_symptom_checker"

    def run(self, dispatcher, tracker, domain):
        symptom = tracker.get_slot("symptom")

        if not symptom:
            dispatcher.utter_message(text="Can you describe your symptom?")
            return []

        dispatcher.utter_message(
            text=f"For your symptom ({symptom}), basic rest and hydration may help."
        )
        return []


class ActionEmergencyProtocol(Action):
    def name(self) -> Text:
        return "action_emergency_protocol"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(
            text="🚨 This looks like an emergency. Call local emergency services immediately!"
        )
        return []
