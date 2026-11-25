  export default async function handler(req, res){
    if(req.method === 'GET'){
      if(req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) return res.send(req.query['hub.challenge']);
      return res.status(403).send('Forbidden');
    }
    try{
      const entry = req.body.entry?.[0]?.changes?.[0]?.value;
      const msg = entry?.messages?.[0];      if(msg && msg.text){
       const text = msg.text.body.toLowerCase();
       const from = msg.from;
       let reply = "Hi, I'm MediDesk 🩺 Send a symptom like: headache, fever, cough, stomach pain";       if(text.includes('headache')) reply = "Headache: Rest, drink water, avoid screens. 🚨 See a doctor urgently if: worst headache of your life, confusion, or after injury.";
       if(text.includes('fever')) reply = "Fever: Rest, drink fluids, monitor temp. 🚨 See a doctor if: temp above 39.5°C, breathing difficulty, or fever over 3 days.";
       if(text.includes('cough')) reply = "Cough: Warm fluids, rest voice. 🚨 See a doctor if: coughing blood, chest pain, or cough over 2 weeks.";
       if(text.includes('stomach')) reply = "Stomach Pain: Eat light, sip water. 🚨 See a doctor if: severe pain, vomiting blood, or black stool.";
       await fetch(`https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/messages`, {
         method: 'POST',
         headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
         body: JSON.stringify({ messaging_product: 'whatsapp', to: from, text: { body: reply + "\n\n⚠️ General info only, not a doctor's diagnosis." } })
       });
     }
   } catch(e){ console.log(e); }
   res.status(200).send('OK');
 }
