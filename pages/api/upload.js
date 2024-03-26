import multiparty from 'multiparty'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs'
const bucketName = 'rollthelife'
import mime from 'mime-types'
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

// Define the getHeader method
function getHeader(req, headerName) {
  // Retrieve the value of the specified header from the request object
  const headerValue = req.headers.get(headerName);

  // Return the retrieved header value
  return headerValue;
}

export default async function handle(req, res){
    await mongooseConnect();
    await isAdminRequest(res,req);

    const form = new multiparty.Form();
    const {fields,files} = await new Promise((resolve,resject) => {
        form.parse(req, (err, fields, files) => {
            if (err) resject(err);
            resolve({fields,files});
        });
    });
    console.log('length:', files.file.length);
    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
    const links = [];
    for (const file of files.file) {
        const ext= file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '-' + ext;
        console.log({ext,file})
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read', 
            ContentType: mime.lookup(file.path),
        }));
        const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
        links.push(link);
    }
    return res.json({links});
}

export const config = {
    api: {bodyParser: false}, 
}