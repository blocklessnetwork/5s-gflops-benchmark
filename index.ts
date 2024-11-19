import { Date, Console } from "as-wasi/assembly";

function benchmarkGFLOPS(durationSeconds: f64): f64 {
	const start: f64 = Date.now(); // Get the current timestamp in milliseconds
	let elapsedTime: f64 = 0.0;
	let iterations: i32 = 0;
	let sum: f64 = 0.0;

	// Loop until the elapsed time exceeds the specified duration
	while (elapsedTime < durationSeconds * 1000.0) {
		for (let i: i32 = 0; i < 1000; i++) {
			let sqrtI: f64 = Math.sqrt(i);
			let sinI: f64 = Math.sin(i);
			let cosI: f64 = Math.cos(i);
			sum += sqrtI * sinI * cosI; // Sample floating-point operations
		}
		iterations += 1000;
		elapsedTime = Date.now() - start;
	}

	// Calculate GFLOPS
	const totalFlops: f64 = iterations * 3; // 3 FLOPs per iteration
	const gflops: f64 = totalFlops / (elapsedTime / 1000.0) / 1e9;

	Console.log("Sum (to avoid optimization): " + sum.toString()); // Prevents compiler from optimizing out the loop
	return gflops;
}

function runBenchmark(durationSeconds: f64, runs: i32): f64 {
	try {
		// Warm-up phase
		benchmarkGFLOPS(1);

		// Multiple runs
		let totalGFLOPS: f64 = 0.0;
		for (let i: i32 = 0; i < runs; i++) {
			totalGFLOPS += benchmarkGFLOPS(durationSeconds);
		}

		// Average GFLOPS
		return totalGFLOPS / runs;
	} catch (e) {
		Console.error("An error occurred during benchmarking: " + e.toString());
		return 0.0;
	}
}

// Ensure isolation by running the benchmark in a controlled environment
Console.log(`Average GFLOPS: ${runBenchmark(1, 5)}`);
