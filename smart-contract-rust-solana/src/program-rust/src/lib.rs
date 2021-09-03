use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

/// Define the type of state stored in accounts
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct File {
    pub bride_firstname: String,
    pub bride_lastname: String,
    pub groom_firstname: String,
    pub groom_lastname: String,
    pub datetime: String,
    pub location: String,
    pub bestman_firstname: String,
    pub bestman_lastname: String,
    pub maidofhonor_firstname: String,
    pub maidofhonor_lastname: String,
}

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey, // Public key of the account the hello world program was loaded into
    accounts: &[AccountInfo], // The account to say hello to
    instruction_data: &[u8], // File data
) -> ProgramResult {
    // Iterating accounts is safer then indexing
    msg!("Start contract");

    let accounts_iter = &mut accounts.iter();

    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;

    // The account must be owned by the program in order to modify its data
    if account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    msg!("Start instruction decode");
    let file = File::try_from_slice(instruction_data).map_err(|err| {
        msg!("Receiving message as string utf8 failed, {:?}", err);
        ProgramError::InvalidInstructionData
    })?;

    let data = &mut &mut account.data.borrow_mut();
    msg!("instruction len {} saved!", instruction_data.len());
    msg!("data len {} saved!", data.len());

    data[..instruction_data.len()].copy_from_slice(&instruction_data);

    msg!("File with name {} saved!", file.groom_firstname);

    Ok(())
}
