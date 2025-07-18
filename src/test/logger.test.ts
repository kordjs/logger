/**
 * Test suite for TraceKit Logger
 */

import { Logger } from '../core/logger'
import { InMemoryTransport } from '../transports/memory'

// Simple test runner
class TestRunner {
  private tests: Array<{ name: string; fn: () => Promise<void> | void }> = []
  private passed = 0
  private failed = 0

  test(name: string, fn: () => Promise<void> | void): void {
    this.tests.push({ name, fn })
  }

  async run(): Promise<void> {
    console.log('🧪 Running TraceKit tests...\n')
    
    for (const { name, fn } of this.tests) {
      try {
        await fn()
        console.log(`✅ ${name}`)
        this.passed++
      } catch (error) {
        console.log(`❌ ${name}`)
        console.error(`   Error: ${error}`)
        this.failed++
      }
    }
    
    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`)
    
    if (this.failed > 0) {
      process.exit(1)
    }
  }
}

const runner = new TestRunner()

// Helper function for assertions
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

// Test: Basic logging
runner.test('Basic logging works', () => {
  const logger = new Logger({ enableRemote: false })
  
  // These should not throw
  logger.debug('Debug message')
  logger.info('Info message')
  logger.warn('Warning message')
  logger.error('Error message')
  logger.fatal('Fatal message')
  logger.success('Success message')
  logger.trace('Trace message')
})

// Test: Configuration
runner.test('Configuration updates work', () => {
  const logger = new Logger()
  
  const originalConfig = logger.getConfig()
  assert(originalConfig.namespace === 'System', 'Default namespace should be System')
  
  logger.configure({ namespace: 'TestApp' })
  const updatedConfig = logger.getConfig()
  assert(updatedConfig.namespace === 'TestApp', 'Namespace should be updated')
})

// Test: Log level filtering
runner.test('Log level filtering works', () => {
  // This test is basic since we can't easily capture console output
  // In a real test environment, you'd mock console.log
  const logger = new Logger({ minLevel: 'warn', enableRemote: false })
  
  // These should work without errors
  logger.warn('This should appear')
  logger.error('This should appear')
  logger.debug('This should not appear')
  logger.info('This should not appear')
})

// Test: Remote logging with memory transport
runner.test('Remote logging with InMemoryTransport', async () => {
  const memoryTransport = new InMemoryTransport()
  
  // We can't directly inject transport, but we can test the transport itself
  const logEntry = {
    level: 'info' as const,
    namespace: 'TestApp',
    message: 'Test message',
    timestamp: new Date().toISOString()
  }
  
  const success = await memoryTransport.send(logEntry)
  assert(success === true, 'Memory transport should successfully send logs')
  
  const logs = memoryTransport.getLogs()
  assert(logs.length === 1, 'Should have one log entry')
  assert(logs[0].message === 'Test message', 'Log message should match')
})

// Test: Memory transport filtering
runner.test('Memory transport filtering', async () => {
  const transport = new InMemoryTransport()
  
  await transport.send({ level: 'info', namespace: 'App1', message: 'Info 1', timestamp: '2023-01-01' })
  await transport.send({ level: 'error', namespace: 'App1', message: 'Error 1', timestamp: '2023-01-01' })
  await transport.send({ level: 'info', namespace: 'App2', message: 'Info 2', timestamp: '2023-01-01' })
  
  const infoLogs = transport.getLogsByLevel('info')
  assert(infoLogs.length === 2, 'Should have 2 info logs')
  
  const app1Logs = transport.getLogsByNamespace('App1')
  assert(app1Logs.length === 2, 'Should have 2 logs from App1')
  
  const errorLogs = transport.getLogsByLevel('error')
  assert(errorLogs.length === 1, 'Should have 1 error log')
})

// Test: Box logging (just ensure it doesn't crash)
runner.test('Box logging works', () => {
  const logger = new Logger({ enableRemote: false })
  
  logger.info('Boxed message', { boxed: true })
  logger.info('Boxed with title', { boxed: true, title: 'Important' })
  logger.error('Boxed error', { boxed: true, centered: true })
})

// Test: Configuration merging
runner.test('Configuration merging', () => {
  const logger = new Logger({
    namespace: 'Initial',
    enableTimestamp: false
  })
  
  let config = logger.getConfig()
  assert(config.namespace === 'Initial', 'Initial namespace should be set')
  assert(config.enableTimestamp === false, 'Timestamp should be disabled')
  assert(config.enableColors === true, 'Colors should have default value')
  
  logger.configure({ namespace: 'Updated' })
  config = logger.getConfig()
  assert(config.namespace === 'Updated', 'Namespace should be updated')
  assert(config.enableTimestamp === false, 'Timestamp should remain disabled')
})

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runner.run().catch(console.error)
}