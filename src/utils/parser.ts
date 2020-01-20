interface Options {
	amount: number;
	from: string | undefined;
	to: string | undefined;
}

/**
* Expression parser
* @param expression Expression you want to parse, ex. `10 usd to pln` or `€1.23 eur`
* @return Object with parsing results
*/
export default function parse(expression: string): Options {
	const amount = parseFloat(expression.replace(/[^0-9-.]/g, '')) || undefined;
	let from;
	let to;

	// Search for `to` keyword (case insensitive) to split the expression into 2 parts
	if (/to/i.exec(expression)) {
		const firstPart = expression.slice(0, expression.search(/to/i)).toUpperCase().trim();

		from = firstPart.replace(/(?<currency_code>[^A-Za-z])/g, '');
		to = expression.slice(expression.search(/to/i) + 2).toUpperCase().trim();
	} else {
		from = expression.replace(/(?<currency_code>[^A-Za-z])/g, '');
	}

	if (amount === undefined) {
		throw new Error('Could not parse the `amount` argument. Make sure it includes at least a valid amount.');
	}

	return {
		amount,
		from: from.toUpperCase() || undefined,
		to
	};
}