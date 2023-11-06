//Дядя Бобби любит переиспользовать код, поэтому он решил вынести фильтры в отдельный файл в виде констант.
export const EXPERT_MEETING = 'expert_meeting';
export const QUESTION_ANSWER = 'question_answer';
export const CONFERENCE = 'conference';
export const WEBINAR = 'webinar';

export const TYPES = {
    [EXPERT_MEETING]: 'Expert Meeting',
    [QUESTION_ANSWER]: 'Question & Answer',
    [CONFERENCE]: 'Conference',
    [WEBINAR]: 'Webinar'
}
export default {
    [EXPERT_MEETING]: false,
    [QUESTION_ANSWER]: false,
    [CONFERENCE]: false,
    [WEBINAR]: false
}
