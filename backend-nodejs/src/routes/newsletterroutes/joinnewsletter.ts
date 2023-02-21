import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import NewsletterModel from '../../models/NewsletterModel.js';
import { sendEmail } from '../../utilities.js';

export const joinNewsletter = async (req: Request, res: Response) => {

    const email = req.query?.email;
    const domain = req.headers.origin;
    
    const greetEmail = (email: string, unsubCode: string) => {
        let sent = true;

        const emailBody = 
            "<p>Thanks for joining our newsletter.</p>"+
            "<p>If you want to unsubscibe to our newsletter, "+
            "click this <a href=\""+
            domain+"/newsletter/unsub/"+unsubCode+"\">link</a></p>"+
            "<p>If link is blocked, copy this link<br /><b>"+
            domain+"/newsletter/unsub/"+unsubCode+"</b><br /><br />"+
            "Then, place the link in your browser."+
            "</p>";

            var mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: 'Shopper Newsletter',
            html: emailBody,
            };
                
            sendEmail().sendMail(mailOptions, function(error){
                if (error) {
                    sent = false;
                    console.error(error);
                    res.status(500).send("Unexpected Error.");
                }
            }); 
        return sent;
    }

    try{
        
        if(email) {
            const newsLetterDoc = await NewsletterModel.find({});

            let isJoined = false;
            if(newsLetterDoc.length) {

                for(let x = 0; x < newsLetterDoc.length; x++) {
                    for(let y of newsLetterDoc[x].emailAddresses) {
                        if(email === y.email) {
                            isJoined = true;
                            break;
                        }
                    }
                    if(isJoined) break;

                    if(x === newsLetterDoc.length - 1) {
                        const randBytes = randomBytes(12).toString('hex').toString();
                        newsLetterDoc[x].emailAddresses =
                            [...newsLetterDoc[x].emailAddresses,
                             {
                                email: email.toString(), 
                                unsubCode: randBytes,
                             }
                            ];
                        newsLetterDoc[x].isNew = false;
                        await newsLetterDoc[x].save();
                        greetEmail(email as string, randBytes);
                    }
                }
            }
            else {
                const randBytes = randomBytes(12).toString('hex').toString();
                const newNewsLetter = new NewsletterModel({
                    emailAddresses: [{
                        email,
                        unsubCode: randBytes
                    }],
                });
                newNewsLetter.isNew = true;
                await newNewsLetter.save();
                greetEmail(email as string, randBytes);
            }
            if(process.env.NODE_ENV === 'production') {
                res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
            }
            res.status(200).json({isJoined});
        }
        else {
            res.sendStatus(400);
        }
    }
    catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
};
