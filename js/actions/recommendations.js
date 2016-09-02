'use strict';

import type {Action, RecommendationCode} from './types'

export const REACH_DECISION = "REACH_DECISION";
export const TOGGLE_REMINDER = "TOGGLE_REMINDER";
export const SET_REMINDER_DATE = "SET_REMINDER_DATE";

export function reachDecision(decision:RecommendationCode, questionnaireType:string):Action {
  return {
    type: REACH_DECISION,
    decision,
    questionnaireType,
  }
}

export function toggleReminder(questionnaireType:string):Action {
  return {
    type: TOGGLE_REMINDER,
    questionnaireType
  }
}

export function setReminderDate(date:Date, questionnaireType:string):Action {
  return {
    type: SET_REMINDER_DATE,
    date,
    questionnaireType,
  }
}
