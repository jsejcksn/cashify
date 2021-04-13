import {assertStrictEquals, assertThrows} from './test_deps.ts';
import convert from './convert.ts';

const rates = {
	GBP: 0.92,
	EUR: 1,
	USD: 1.12
};

Deno.test('basic conversion', () => {
	assertStrictEquals(convert(12, {from: 'USD', to: 'GBP', base: 'EUR', rates}), 9.857142857142856);
});

Deno.test('`from` equals `base`', () => {
	assertStrictEquals(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.2);
});

Deno.test('`to` equals `base`', () => {
	assertStrictEquals(convert(10, {from: 'GBP', to: 'EUR', base: 'EUR', rates}), 10.869565217391303);
});

Deno.test('`from` equals `to`', () => {
	assertStrictEquals(convert(10, {from: 'USD', to: 'USD', base: 'EUR', rates}), 10);
});

Deno.test('`from` equals `to`, but `base` is different', () => {
	assertStrictEquals(convert(10, {from: 'EUR', to: 'EUR', base: 'USD', rates}), 10);
});

Deno.test('accept `amount` of type `string`', () => {
	assertStrictEquals(convert('12', {from: 'USD', to: 'GBP', base: 'EUR', rates}), 9.857142857142856);
});

Deno.test('edge case: accept `amount` of type `string`, equal to 0', () => {
	assertStrictEquals(convert('0', {from: 'USD', to: 'GBP', base: 'EUR', rates}), 0);
});

Deno.test('`amount` equals 0', () => {
	assertStrictEquals(convert(0, {from: 'USD', to: 'GBP', base: 'EUR', rates}), 0);
});

Deno.test('basic parsing (integer)', () => {
	assertStrictEquals(convert('$12 USD', {to: 'GBP', base: 'EUR', rates}), 9.857142857142856);
});

Deno.test('basic parsing (float)', () => {
	assertStrictEquals(convert('1.23 GBP', {to: 'EUR', base: 'USD', rates}), 1.3369565217391304);
});

Deno.test('full parsing (integer)', () => {
	assertStrictEquals(convert('$12 USD TO GBP', {base: 'EUR', rates}), 9.857142857142856);
	assertStrictEquals(convert('$12 USD IN GBP', {base: 'EUR', rates}), 9.857142857142856);
	assertStrictEquals(convert('$12 USD AS GBP', {base: 'EUR', rates}), 9.857142857142856);
});

Deno.test('full parsing (float)', () => {
	assertStrictEquals(convert('1.23 gbp to eur', {base: 'USD', rates}), 1.3369565217391304);
	assertStrictEquals(convert('1.23 gbp in eur', {base: 'USD', rates}), 1.3369565217391304);
	assertStrictEquals(convert('1.23 gbp as eur', {base: 'USD', rates}), 1.3369565217391304);
});

Deno.test('`from` is not defined', () => {
	assertThrows(() => {
		convert(10, {to: 'EUR', base: 'USD', rates});
	}, Error, 'Please specify the `from` and/or `to` currency or use parsing!');
});

Deno.test('`rates` without `base` currency', () => {
	const rates = {
		GBP: 0.92,
		USD: 1.12
	};

	assertStrictEquals(convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}), 9.2);
});

Deno.test('`rates` object does not contain either `from` or `to` currency', () => {
	assertThrows(() => {
		convert(10, {from: 'CHF', to: 'EUR', base: 'EUR', rates});
	}, Error, '`rates` object does not contain either `from` or `to` currency!');
});

Deno.test('parsing without a correct amount', () => {
	assertThrows(() => {
		convert('', {base: 'EUR', rates});
	}, TypeError, 'Could not parse the `amount` argument. Make sure it includes at least a valid amount.');
});
