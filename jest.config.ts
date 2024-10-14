import type {Config} from '@jest/types'

const config: Config.InitialOptions={
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose:true,
    testMatch: ['**/*.test.ts']
}
export default config