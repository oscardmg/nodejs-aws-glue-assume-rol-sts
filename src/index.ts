import { STSClient } from "@aws-sdk/client-sts";
import { AssumeRoleCommand } from "@aws-sdk/client-sts";
import { GlueClient, GetSchemaCommand } from '@aws-sdk/client-glue';
import dotenv from 'dotenv';

dotenv.config();

export const main = async () => {
  try {
    const credentials = await provideAuthentication();

    const clientGlue = new GlueClient({
      region: 'us-east-1',
      credentials,
    });
  
    const params = {
      SchemaId: {
        SchemaArn: process.env.SCHEMA_ARN,
      },
    };
    const getSchemaCommand = new GetSchemaCommand(params);
  
    const res = await clientGlue.send(getSchemaCommand);
    console.log(res);
    
  } catch (err) {
    console.error(err);
  }
};


export async function provideAuthentication(): Promise<any> {
  const client = new STSClient({ region: 'us-east-1' });
  const command = new AssumeRoleCommand({
    RoleArn: process.env.ROLE_ARN,
    RoleSessionName: "session1",
    DurationSeconds: 900,
  });
  const response = await client.send(command);

  return {
    accessKeyId: response.Credentials!.AccessKeyId!,
    secretAccessKey: response.Credentials!.SecretAccessKey!,
    sessionToken: response.Credentials!.SessionToken!,
  };
}

main().catch(console.error);