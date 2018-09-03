
# Add-on Security

## Rating

Hass.io rating every add-on of his wanted rights. A add-on with rating of 6 is very secure in other case with 1, you don't should run this add-on if you are not 100% sure that you can trust him.

## Protectetion

Default, all add-on run in a protection enabled modus and they protect the user that the add-on can grant to high rights on his system. If you want run a add-on with options they need to disable this add-on, you can disable this for you add-on over the API add-on options for that add-on. But be carfuly, a add-on with disabled protection can destroy your system!

# Make you add-on secure

Follow best praxis make your add-on secure:
- Don't run on host network
- Create a AppArmor profile
- Map folders read only if you don't need write access
