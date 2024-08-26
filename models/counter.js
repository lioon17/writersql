async function updateCounter(name) {
  const [rows] = await connection.query('SELECT seq FROM counters WHERE name = ?', [name]);
  if (rows.length > 0) {
      const seq = rows[0].seq;
      await connection.query('UPDATE counters SET seq = seq + 1 WHERE name = ?', [name]);
      return seq;
  } else {
      await connection.query('INSERT INTO counters (name, seq) VALUES (?, ?)', [name, 100000]);
      return 100000;
  }
}
