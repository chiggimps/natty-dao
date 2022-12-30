use scrypto::prelude::*;

pub struct VerifiedUser {
    pub inaturalistID: String,
    pub radixWallet: String,
    pub verified: bool,
}

blueprint! {

    struct INattyVerify {
        verifications: HashMap<String, VerifiedUser>,
    }

    impl INattyVerify {
        
        // This is a function, and can be called directly on the blueprint once deployed
        // This returns a component address (whoever instantiates will receive an admin badge.)
        pub fn instantiate_verify() -> (ComponentAddress, Bucket) {

            let admin_badge = ResourceBuilder::new_fungible()
                .divisibility(DIVISIBILITY_NONE)
                .metadata("name", "INattyVerify Admin Badge")
                .initial_supply(1);

            let verified_badge = ResourceBuilder::new_fungible()
                .divisibility(DIVISIBILITY_NONE)
                .metadata("name", "INatty User Verified Badge")
                .initial_supply(1);

            let access_rule = AccessRules::new()
                .default(rule!(require(admin_badge.resource_address()))); // by default, every method requires badge

            // Instantiate a new component
            let mut verify_component = Self {
                admin_badge: Vault::new(admin_badge.resource_address()),
                verifications: HashMap::new(),
            }
            .instantiate();
            verify_component.add_access_check(access_rule);

            (verify_component.globalize(), admin_badge)
        }

        // give them a badge if they pass the check
        pub fn verify_user(&mut self) -> ResourceAddress {

            // TBD
            
        }
    }
}