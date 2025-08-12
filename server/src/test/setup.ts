// Jest setup file for server tests
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Make Jest globals available globally
global.jest = jest;
global.describe = describe;
global.it = it;
global.expect = expect;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
