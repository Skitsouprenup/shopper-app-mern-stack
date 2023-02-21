import { Request, Response } from 'express';
import NewsletterModel from '../../models/NewsletterModel.js';

export const unsubNewsLetter = async (req: Request, res: Response) => {

    const unsubCode = req.query?.unsubcode;

    try {
        if(unsubCode) {
            const newsLetterDoc = 
                await NewsletterModel.findOne(
                    {
                        'emailAddresses.unsubCode': unsubCode as string
                    },
                    {
                        _id: 1, 
                        emailAddresses: 1,
                    }
                );

            if(newsLetterDoc) {
                const emails = 
                    newsLetterDoc.emailAddresses.
                    filter((item) => item.unsubCode !== unsubCode);
                
                newsLetterDoc.emailAddresses = [...emails];
                newsLetterDoc.isNew = false;
                await newsLetterDoc.save();

                if(process.env.NODE_ENV === 'production') {
                    res.set({'Access-Control-Allow-Origin' : process.env.FRONT_END_DOMAIN});
                }
                res.status(200).send("You are now unsubscribed to the newsletter.");
            } else {
                res.status(404).send("Can't unsubscribe because your unsubscription"+
                " code can't be found in the record.");
            }
        } else {
            res.status(400).send("Can't unsubscribe because your unsubscription"+
            " code is invalid.");
        }
    }
    catch(e) {
        console.error(e);
        res.status(500).send("Internal server error.");
    }
}