import {assertStrictEquals, assertThrows} from './test_deps.ts';
import Cashify from './cashify.ts';

const rates = {
	GBP: 0.92,
	EUR: 1,
	USD: 1.12
};

const cashify = new Cashify({base: 'EUR', rates});

Deno.test('basic conversion', () => {
	assertStrictEquals(cashify.convert(12, {from: 'USD', to: 'GBP'}), 9.857142857142856);
});

Deno.test('`from` equals `base`', () => {
	assertStrictEquals(cashify.convert(10, {from: 'EUR', to: 'GBP'}), 9.2);
});

Deno.test('`to` equals `base`', () => {
	assertStrictEquals(cashify.convert(10, {from: 'GBP', to: 'EUR'}), 10.869565217391303);
});

Deno.test('`from` equals `to`', () => {
	assertStrictEquals(cashify.convert(10, {from: 'USD', to: 'USD'}), 10);
});

Deno.test('`from` equals `to`, but `base` is different', () => {
	const cashify = new Cashify({base: 'USD', rates});
	assertStrictEquals(cashify.convert(10, {from: 'EUR', to: 'EUR'}), 10);
});

Deno.test('accept `amount` of type `string`', () => {
	assertStrictEquals(cashify.convert('12', {from: 'USD', to: 'GBP'}), 9.857142857142856);
});

Deno.test('edge case: accept `amount` of type `string`, equal to 0', () => {
	assertStrictEquals(cashify.convert('0', {from: 'USD', to: 'GBP'}), 0);
});

Deno.test('`amount` equals 0', () => {
	assertStrictEquals(cashify.convert(0, {from: 'USD', to: 'GBP'}), 0);
});

Deno.test('basic parsing (integer)', () => {
	assertStrictEquals(cashify.convert('$12 USD', {to: 'GBP'}), 9.857142857142856);
});

Deno.test('basic parsing (float)', () => {
	assertStrictEquals(cashify.convert('1.23 GBP', {to: 'EUR'}), 1.3369565217391304);
});

Deno.test('full parsing (integer)', () => {
	assertStrictEquals(cashify.convert('$12 USD TO GBP'), 9.857142857142856);
	assertStrictEquals(cashify.convert('$12 USD IN GBP'), 9.857142857142856);
	assertStrictEquals(cashify.convert('$12 USD AS GBP'), 9.857142857142856);
});

Deno.test('full parsing (float)', () => {
	assertStrictEquals(cashify.convert('1.23 gbp to eur'), 1.3369565217391304);
	assertStrictEquals(cashify.convert('1.23 gbp in eur'), 1.3369565217391304);
	assertStrictEquals(cashify.convert('1.23 gbp as eur'), 1.3369565217391304);
});

Deno.test('`from` is not defined', () => {
	assertThrows(() => {
		cashify.convert(10, {to: 'EUR'});
	}, Error, 'Please specify the `from` and/or `to` currency or use parsing!');
});

Deno.test('`rates` without `base` currency', () => {
	const rates = {
		GBP: 0.92,
		USD: 1.12
	};

	const cashify = new Cashify({base: 'EUR', rates});
	assertStrictEquals(cashify.convert(10, {from: 'EUR', to: 'GBP'}), 9.2);
});

Deno.test('`rates` object does not contain either `from` or `to` currency', () => {
	assertThrows(() => {
		cashify.convert(10, {from: 'CHF', to: 'EUR'});
	}, Error, '`rates` object does not contain either `from` or `to` currency!');
});

Deno.test('parsing without a correct amount', () => {
	assertThrows(() => {
		cashify.convert('');
	}, TypeError, 'Could not parse the `amount` argument. Make sure it includes at least a valid amount.');
});
