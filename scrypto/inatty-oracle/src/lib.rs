use scrypto::prelude::*;

// An NFT that will be minted each time there's an observation.
// The owner can buy it for a discount, which will fund the NattyDAO treasury.
// These observation NFTs are purchased only with INATTY token. That's what backs the token with relationships to nature.
#[derive(NonFungibleData)]
pub struct ObservationData {
    pub date: String,
    pub location: String,
    pub user: Address,
    pub image_url: String
}

blueprint! {
    struct INattyOracle {
        // Define what resources and data will be managed by Hello components
        sample_vault: Vault,
        // Admin badge
        admin_badge: ResourceAddress,
        // Map of accounts to iNaturalist observations (NFT Resource Addresses?)
        observations: HashMap<Address, Vec<ObservationData>>,
        // 
    }

    impl INattyOracle {
        
        // This is a function, and can be called directly on the blueprint once deployed
        pub fn instantiate_oracle() -> ComponentAddress {
            // Create a new token called "HelloToken," with a fixed supply of 1000, and put that supply into a bucket
            let my_bucket: Bucket = ResourceBuilder::new_fungible()
                .metadata("name", "HelloToken")
                .metadata("symbol", "HT")
                .initial_supply(1000);

            // Instantiate a Hello component, populating its vault with our supply of 1000 HelloToken
            Self {
                sample_vault: Vault::with_bucket(my_bucket)
            }
            .instantiate()
            .globalize()
        }

        // This is a method, because it needs a reference to self.  Methods can only be called on components
        pub fn free_token(&mut self) -> Bucket {
            info!("My balance is: {} HelloToken. Now giving away a token!", self.sample_vault.amount());
            // If the semi-colon is omitted on the last line, the last value seen is automatically returned
            // In this case, a bucket containing 1 HelloToken is returned
            self.sample_vault.take(1)
        }
    }
}