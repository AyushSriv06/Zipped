export function sendSol(amount: string, address: string): void {
    console.log(`Simulating SOL transfer of ${amount} to address ${address}`);

    const isSuccess = Math.random() < 0.9;

    setTimeout(() => {
        if (isSuccess) {
            alert(`Successfully sent ${amount} SOL to ${address}!`);
        } else {
            alert(`Transaction failed! Please try again.`);
        }
    }, 2000); // Simulate network delay
}