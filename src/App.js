import { PutObjectCommand, S3Client, S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import "./styles.css";
export const getBlob = async (fileUri) => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

const AWS_BUCKET_NAME = "myproad";
const AWS_BUCKET_REAGION = "ap-south-1";
const AWS_ACCESS_KEY = "AKIAVIQVGNRIABHO52W4";
const AWS_SECRET_KEY = "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";

export default function App() {
  console.log(`${new Date()}`);

  const myS3Client = new S3Client({
    Bucket: AWS_BUCKET_NAME,
    region: AWS_BUCKET_REAGION,
    Key: new Date().valueOf(),
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY
    }
  });

  const myS3Object = new S3({
    Bucket: AWS_BUCKET_NAME,
    region: AWS_BUCKET_REAGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY
    }
  });

  const upload = async (file) => {
    const fileO = file.target.files[0];
    console.log("fileO");
    console.log(fileO);
    debugger;
    const target = {
      Bucket: AWS_BUCKET_NAME,
      Key: file.name,
      Body: fileO.stream()
    };

    // const command = new PutObjectCommand(target);
    // console.log("command created");
    // const d = await myS3Client.send(command);
    // console.log("d");
    // console.log(d);
    // return;
    try {
      const parallelUPloadS3 = new Upload({
        region: AWS_BUCKET_REAGION,
        Bucket: AWS_BUCKET_NAME,
        client: myS3Client,
        leavePartsOnError: false,
        params: new PutObjectCommand(target)
      });

      parallelUPloadS3.on("httpUploadProgress", (progress) => {
        console.log(progress);
      });

      parallelUPloadS3.done();
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const listBucket = async () => {
    alert(myS3Client.listObjects);
  };
  return (
    <>
      <input type="file" name="S3 upload" onChange={upload} />
      <button onClick={listBucket}>Get Buckets</button>
    </>
  );
}
