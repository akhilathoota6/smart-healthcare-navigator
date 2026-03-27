export function calculateScore(hospital) {
  return (
    0.5 * hospital.rating +
    0.3 * (1 / (hospital.distance + 1)) +
    0.2 * (1 / (hospital.wait_time_minutes + 1))
  );
}
