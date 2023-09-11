import otpController from '../otpController';

export async function clearExpiredOtps() {
    try {
        await otpController.clearExpiredOtps();
        console.log('Cleared expired OTPs');
    } catch (error) {
        console.error(error);
    }
}