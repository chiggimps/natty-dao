use scrypto::prelude::*;

#[derive(NonFungibleData)]
pub struct ObservationData {
    pub id: String, // Unique ID for the observation
    pub date: String, // YYYY-MM-DD
    pub location: String, // GPS coordinates
    pub user: String, // Name of user who created this observation
    pub image_url: String, // URL to image
    pub species: String, // Name of species
    pub description: String // Description of observation
}

blueprint! {

    struct INatty {
        // Define what resources and data will be managed by INattyOracle component
        mint_badge: Vault,
        nft_resource_address: ResourceAddress
    }

    impl INatty {
        
        // This is a function, and can be called directly on the blueprint once deployed
        // This returns a component address (whoever instantiates will receive an admin badge.)
        pub fn instantiate_inatty() -> (ComponentAddress, Bucket) {

            let admin_badge = ResourceBuilder::new_fungible()
                .divisibility(DIVISIBILITY_NONE)
                .metadata("name", "INatty Admin Badge")
                .initial_supply(1);

            let nft_resource_address = ResourceBuilder::new_non_fungible()
                .metadata("name", "INatty Nature Experience NFT")
                .mintable(rule!(require(admin_badge.resource_address())), LOCKED)
                .burnable(rule!(require(admin_badge.resource_address())), LOCKED)
                .updateable_non_fungible_data(rule!(require(admin_badge.resource_address())), LOCKED)
                .no_initial_supply();

            // Access rule (for admin badge to call create_nft)
            let access_rule = AccessRules::new()
                .default(rule!(require(admin_badge.resource_address()))); // by default, every method requires badge

            // Instantiate a new component
            let mut mint_component = Self {
                admin_badge: Vault::new(admin_badge.resource_address()), // stays within component (as opposed to admin_badge which is used to access component)
                nft_resource_address
            }
            .instantiate();
            mint_component.add_access_check(access_rule);

            (mint_component.globalize(), admin_badge)
        }

        // Create NFT is called by an RTM submitted from the user
        // The user needs to have a verified badge to call this method
        pub fn create_nft(&mut self, id: String, date: String, location: String, user: String, image_url: String, species: String) -> ResourceAddress {
            
            let d = format!("{} observed on {}", species, date);
            let idcopy = format!("{}", id);

            let nft_data = ObservationData {
                id: idcopy,
                date,
                location,
                user,
                image_url,
                species,
                description: d,
            };

            // convert id (which is a number) to u64
            let idcopy = format!("{}", id);
            let id_u64 = idcopy.parse::<u64>().unwrap();

            // Goes into mint badge vault, and authorizing (creating a proof of that badge),
            // Putting that into the local component's authorization zone. Which allows resource manager to do the updates.
            let nft = self.admin_badge.authorize(|| {
                let resource_manager = borrow_resource_manager!(self.nft_resource_address);
                resource_manager.mint_non_fungible(
                    // The NFT id
                    &NonFungibleId::from_u64(id_u64),
                    // The NFT data
                    nft_data,
                )
            });

            nft.resource_address()
            
        }

        // Update method, where the relay has access to account,
        // pulls a proof of the badge, and then they have update authority
        // this could be if the species changed due to curation
        // pub fn update_nft() {

        // }
    }
}