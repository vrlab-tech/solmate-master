import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import fs from 'mz/fs';
import path from 'path';
import * as borsh from 'borsh';
import { createKeypairFromFile, getRpcUrl, newAccountWithLamports } from "./helpers";

let connection: Connection;
let payer: Keypair;
let programId: PublicKey = new PublicKey(process.env.REACT_APP_PROGRAM_ID);
let greetedPubKey: PublicKey;
const PROGRAM_PATH = path.resolve(__dirname, '../../../../smart-contract-rust-solana/dist/program')
// const PROGRAM_PATH = path.resolve(__dirname, '../../../smart-contract-rust-solana/dist/program')
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'registry.so')
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'registry-keypair.json')

class Registry{
    bride_firstname = '';
    bride_lastname = '';
    groom_firstname = '';
    groom_lastname = '';
    datetime = '';
    location = '';
    bestman_firstname = '';
    bestman_lastname = '';
    maidofhonor_firstname = '';
    maidofhonor_lastname = '';

    constructor(
        fields:
        | { bride_firstname: string; bride_lastname: string; groom_firstname: string; groom_lastname: string; datetime: string; location: string; bestman_firstname: string; bestman_lastname: string; maidofhonor_firstname: string; maidofhonor_lastname: string; }
      | undefined = undefined,
    ) {
        if (fields) {
            this.bride_firstname = fields.bride_firstname;
            this.bride_lastname = fields.bride_lastname;
            this.groom_firstname = fields.groom_firstname;
            this.groom_lastname = fields.groom_lastname;
            this.datetime = fields.datetime;
            this.location = fields.location;
            this.bestman_firstname = fields.bestman_firstname;
            this.bestman_lastname = fields.bestman_lastname;
            this.maidofhonor_firstname = fields.maidofhonor_firstname;
            this.maidofhonor_lastname = fields.maidofhonor_lastname;
          }
    }
}
/**
 * Borsh schema definition for greeting accounts
 */
 const RegistrySchema = new Map([
    [
      Registry,
      {
        kind: 'struct',
        fields: [
          ['bride_firstname', 'String'],
          ['bride_lastname', 'String'],
          ['groom_firstname', 'String'],
          ['groom_lastname', 'String'],
          ['datetime', 'String'],
          ['location', 'String'],
          ['bestman_firstname', 'String'],
          ['bestman_lastname', 'String'],
          ['maidofhonor_firstname', 'String'],
          ['maidofhonor_lastname', 'String']
          
        ],
      },
    ],
  ]);

  /**
 * Establish a connection to the cluster
 */
export async function establishConnection(): Promise<void> {
    const rpcUrl = await getRpcUrl();
    connection = new Connection(rpcUrl, 'confirmed');
    const version = await connection.getVersion();
    console.log('Connection to cluster established:', rpcUrl, version);
  }
  
  /**
 * Establish an account to pay for everything
 */
export async function establishPayer(details:Registry): Promise<void> {
  let fees = 0;
  // Calculate the cost to fund the greeter account
  const sampleFile = new Registry(details);
  const FILE_SIZE = borsh.serialize(RegistrySchema, sampleFile).length;

  fees = await connection.getMinimumBalanceForRentExemption(FILE_SIZE);

  payer = await newAccountWithLamports(connection, 100000000);

  const lamports = await connection.getBalance(payer.publicKey);
  if (lamports < fees) {
    // This should only happen when using cli config keypair
    const sig = await connection.requestAirdrop(
      payer.publicKey,
      fees - lamports,
    );
    await connection.confirmTransaction(sig);
  }

  console.log(
    'Using account',
    payer.publicKey.toBase58(),
    'containing',
    lamports / LAMPORTS_PER_SOL,
    'SOL to pay for fees',
  );
}

/**
 * Check if the hello world BPF program has been deployed
 */
 export async function checkProgram(details:Registry): Promise<void> {
  // Read program id from keypair file
  const sampleFile = new Registry(details);
  const FILE_SIZE = borsh.serialize(RegistrySchema, sampleFile).length;

  // try {
  //   const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
  //   programId = programKeypair.publicKey;
  //   console.log("pid", programId);
  // } catch (err) {
  //   const errMsg = (err as Error).message;
  //   throw new Error(
  //     `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/helloworld.so\``,
  //   );
  // }

  // Check if the program has been deployed
  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
    if (fs.existsSync(PROGRAM_SO_PATH)) {
      throw new Error(
        'Program needs to be deployed with `solana program deploy dist/program/registry.so`',
      );
    } else {
      throw new Error('Program needs to be built and deployed');
    }
  } else if (!programInfo.executable) {
    throw new Error(`Program is not executable`);
  }
  console.log(`Using program ${programId.toBase58()}`);

  // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
  const GREETING_SEED = 'hello';
  greetedPubKey = await PublicKey.createWithSeed(
    payer.publicKey,
    GREETING_SEED,
    programId,
  );

  // Check if the greeting account has already been created
  const greetedAccount = await connection.getAccountInfo(greetedPubKey);
  if (greetedAccount === null) {
    console.log(
      'Creating account',
      greetedPubKey.toBase58(),
      'to say hello to',
    );
    const lamports = await connection.getMinimumBalanceForRentExemption(
      FILE_SIZE,
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubKey,
        lamports,
        space: FILE_SIZE,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [payer]);
  }
}

/**
 * Save details
 */
 export async function saveWedding(details:Registry): Promise<{trx:string,greetedPubKey:string}> {
  console.log('Sending data to', greetedPubKey.toBase58());

  const fileAccount = new Registry();

  fileAccount.bride_firstname = details.bride_firstname;
  fileAccount.bride_lastname = details.bride_lastname;
  fileAccount.groom_firstname = details.groom_firstname;
  fileAccount.groom_lastname = details.groom_lastname;
  fileAccount.datetime = details.datetime;
  fileAccount.location = details.location;
  fileAccount.bestman_firstname = details.bestman_firstname;
  fileAccount.bestman_lastname = details.bestman_lastname;
  fileAccount.maidofhonor_firstname = details.maidofhonor_firstname;
  fileAccount.maidofhonor_lastname = details.maidofhonor_lastname;

  const instruction = new TransactionInstruction({
    keys: [{pubkey: greetedPubKey, isSigner: false, isWritable: true}],
    programId,
    data: Buffer.from(borsh.serialize(RegistrySchema, fileAccount)),
  });

  let trx = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payer],
  );
   console.log("trx", trx)
   return {trx,greetedPubKey:greetedPubKey.toBase58()}
}

/**
 * Report the number of times the greeted account has been said hello to
 */
export async function reportGreetings(): Promise<void> {
  const accountInfo = await connection.getAccountInfo(greetedPubKey);
  if (accountInfo === null) {
    throw 'Error: cannot find the greeted account';
  }
  const registry: Registry = borsh.deserialize(RegistrySchema, Registry, accountInfo.data);

  console.log(
    greetedPubKey.toBase58(),
    greetedPubKey.toString(),
    'Congratulations your wedding is registered successfully',
    registry,
  );
}

export async function registerWeeding  (details: Registry) : Promise<{trx:string,greetedPubKey:string}> {
  console.log("Let's start registering",details);

    await establishConnection();

  // Determine who pays for the fees
  await establishPayer(details);

  // Check if the program has been deployed
  await checkProgram(details);

  // Say hello to an account
  const saved_details:{trx:string,greetedPubKey:string} = await saveWedding(details);

  // Find out how many times that account has been greeted
  await reportGreetings();

  console.log('Success');
  return saved_details
}