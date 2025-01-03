import { Logger } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs';

export enum ENV_VARIABLES {
  FIRESTORE_PROJECT_ID = "FIRESTORE_PROJECT_ID",
  FIRESTORE_CLIENT_EMAIL = "FIRESTORE_CLIENT_EMAIL",
  FIRESTORE_PRIVATE_KEY = "FIRESTORE_PRIVATE_KEY",
  FIRESTORE_DATABASE_URL = "FIRESTORE_DATABASE_URL",
}

export class Handler {
  private readonly logger = new Logger(Handler.name + ":GIT SUBMODULE");

  constructor(private variables: Record<ENV_VARIABLES, string>) {
    this.logger.log(
      `Loaded ENV variables in GIT SUBMODULE package handler: ${JSON.stringify(this.variables, null, 2)}`
    );
  }

  async handle(data: { [key: string]: any }) {
    this.logger.log(`Executing GIT SUBMODULE handler: ${JSON.stringify(data)}`);

    try {
      // Use process.cwd() to get the root directory of the consuming project
      const filePath = path.join(process.cwd(), 'data.json');
      
      // Read existing data if file exists
      let existingData = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        existingData = JSON.parse(fileContent);
      }

      // Add new data with timestamp
      existingData.push({
        ...data,
        timestamp: new Date('2025-01-03T12:59:01+01:00').toISOString()
      });

      // Write the updated data back to file
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      this.logger.log(`Data saved to ${filePath}`);

      return {
        message: "Processed with GIT SUBMODULE handler and saved to data.json",
        success: true,
        filePath,
        data,
      };
    } catch (error: any) {
      this.logger.error(`Error saving data: ${error.message}`);
      throw error;
    }
  }
}
