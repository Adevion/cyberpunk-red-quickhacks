export async function migrateActor(
actor
) {

if (
!actor.getFlag(
"cpred-edgerunners-quickhacks",
"neuroport"
)
) {

await actor.setFlag(
"cpred-edgerunners-quickhacks",
"neuroport",
{
selfIce: 0,
firewallBreached: false,
passwallsRemaining: 0,
directConnection: false
}
);

}
}