const authKey = "key=AAAAfeAFOqY:APA91bHQIFBuzEKnS1kOWUju1LuaTWqcVtoFndMGjzpXhC96zq-6NCREUKgWER39f99Mm8cgKBbC_7S0h2XcqFX1uRArPDUgRctyziJtCr3HfAOESpZn-VQirU2IFl0mnHz1p-Ks0giD";

const header = {
  Accept: 'application/json',
  "Content-Type": "application/json",
  "Authorization": authKey,
};
export const sendNotification = (title, message, tokens) => {
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: header,
    body: JSON.stringify({
      notification: {
        title: title,
        // image: 'https://firebase.google.com/images/social.png',
        body: message
      },
      registration_ids: tokens
    })
  })
}

export const parentTookALeave = (title, message,child, tokens) => {
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: header,
    body: JSON.stringify({
     data: {
        title: title,
        // image: 'https://firebase.google.com/images/social.png',
        message: message,
        isParentLeft:  true,
        child: child 
      },
      priority: "high",
      registration_ids: tokens
    })
  })
}