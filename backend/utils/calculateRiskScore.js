/**
 * Centralized utility to compute risk score and behavioral classification dynamically.
 * 
 * Reversibility Guarantee: Calculates strictly from current metrics, allowing
 * downgrades (HighRisk -> Safe) after successful logins clear short-term memory.
 */
export const calculateRiskScoreAndStatus = (failedAttempts, totalFailedAttempts) => {
    let riskScore = (failedAttempts * 3) + (totalFailedAttempts > 10 ? 2 : 0);

    let systemStatus = 'Safe';
    if (riskScore >= 3 && riskScore <= 5) {
        systemStatus = 'Suspicious';
    } else if (riskScore > 5) {
        systemStatus = 'HighRisk';
    }

    return { riskScore, systemStatus };
};
