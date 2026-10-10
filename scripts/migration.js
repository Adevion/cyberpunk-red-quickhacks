export async function migrateActor(
actor
) {

if (
!actor.getFlag(
"cyberpunk-red-quickhacks",
"neuroport"
)
) {

await actor.setFlag(
"cyberpunk-red-quickhacks",
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