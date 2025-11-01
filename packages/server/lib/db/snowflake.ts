import { SnowflakeId } from '@akashrajpurohit/snowflake-id'

const sf = SnowflakeId({
    workerId: 1,
    epoch: 1735689600000, // since January 1, 2025
})

const snowflake = {
    ...sf,
    generateBigInt: () => BigInt(sf.generate()),
}

export default snowflake
