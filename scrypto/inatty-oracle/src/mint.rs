use scrypto::prelude::*;

// An NFT that will be minted each time there's an observation.
// It will then be listed for sale in a marketplace.
// 50% of the proceeds will be sent to the minter, and 50% to the DAO.
// These observation NFTs are purchased only with INATTY token. 
// That's what backs the token with relationships to nature.

// The relay needs to contain the private key to instantiate this component?
// Or the relay just needs to be able to call the mint function? (a mint badge)
// The relay will then be able to mint the NFTs and list them for sale.
// The relay gets triggered when new observations are made.

#[derive(NonFungibleData)]
pub struct ObservationData {
    pub id: String,
    pub date: String,
    pub location: String,
    pub user: String,
    pub image_url: String
}

blueprint! {

    struct INattyOracle {
        // Define what resources and data will be managed by INattyOracle component
        mint_badge: Vault,
        admin_badge: Vault,
        // List of iNaturalist observation ids already minted
        experiences: Vec<String>,
        // Map of users to iNaturalist observations (NFT ResourceAddress? or NonFungibleId? or ObservationData?)
        // user_observations: Map<String, Vec<NonFungibleId>>,
    }

    impl INattyOracle {
        
        // This is a function, and can be called directly on the blueprint once deployed
        pub fn instantiate_oracle() -> ComponentAddress {

            let mint_badge_bucket = ResourceBuilder::new_fungible()
                .divisibility(DIVISIBILITY_NONE)
                .metadata("name", "Nature Experience Mint Badge")
                .initial_supply(1);

            let admin_badge_bucket = ResourceBuilder::new_fungible()
                .divisibility(DIVISIBILITY_NONE)
                .metadata("name", "NattyDAO Admin Badge")
                .initial_supply(1);

            // Instantiate a new INattyOracle component
            Self {
                mint_badge: Vault::with_bucket(mint_badge_bucket),
                admin_badge: Vault::with_bucket(admin_badge_bucket),
                // observations: HashMap::new(),
            }
            .instantiate()
            .globalize()
        }

        // This will be called from the mint_manifest.rtm
        pub fn create_nft(&mut self, id: String, date: String, location: String, user: Address, image_url: String) -> ResourceAddress {
            
            // Check whether this user has already minted this observation id
            // If not, mint a new NFT and return the address
            if self.experiences.contains(&id) {
                    return 0;
            } else {
                // Create a new NFT with the given data
                let nft_md = ObservationData {
                    id: id,
                    date: date,
                    location: location,
                    user: user,
                    image_url: image_url
                };
                
                let nft_resource = ResourceBuilder::new_non_fungible()
                    .metadata("name", "INatty Nature Experience")
                    .metadata("description", nft_md.user + "obserted on " + nft_md.date.to_string() + " at " + nft_md.location)
                    .metadata("image_url", nft_md.image_url)
                    .mintable(rule!(require(mint_badge.resource_address())), LOCKED)
                    .burnable(rule!(require(mint_badge.resource_address())), LOCKED)
                    .updateable_non_fungible_data(rule!(require(admin_badge.resource_address())), LOCKED)

                // Add to past experiences
                self.experiences.push(id);
            };
        }

        // Method to send NFTs to the marketplace
        // They become for sale, and the proceeds are split between the minter and the DAO
        pub fn list_on_marketplace(&mut self, nft: ResourceAddress) {
            
        }
    }
}