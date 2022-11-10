use scrypto::prelude::*;

// This component is used to register members of the DAO

blueprint! {

    struct Register {
        user_names: Vec<String>,
        admin_badge: Vault,
    }

    impl Register {

        pub fn instantiate_register() -> ComponentAddress {

            let admin_badge_bucket = ResourceBuilder::new_fungible()
                .divisibility(DIVISIBILITY_NONE)
                .metadata("name", "Admin Badge")
                .initial_supply(1);

            // Instantiate a new Register component
            Self {
                user_names: Vec::new(),
                admin_badge: Vault::with_bucket(admin_badge_bucket),
            }
            .instantiate()
            .globalize()
        }
    }

}