const hre = require("hardhat");

async function main() {
    // 1. Contract Factory al
    const GradeNFT = await hre.ethers.getContractFactory("GradeNFT");

    // 2. Contract'ı deploy et ve await ile sonucu bekle
    const contract = await GradeNFT.deploy();

    // 3. Blockchain'e yazılmasını bekle
    await contract.waitForDeployment(); // ✅ yeni Hardhat sürümünde .deployed() yerine bu kullanılmalı

    // 4. Adresi yazdır
    console.log(`Contract deployed to: ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});