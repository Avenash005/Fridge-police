import { useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  // ➕ Add Food
  function addItem() {
    if (!name) return;

    const newItem = {
      id: Date.now(),
      name: name,
      remaining: 100,
      requests: []
    };

    setItems([...items, newItem]);
    setName("");
  }

  // 🙋 Request Food
  function requestFood(itemId) {
    setItems(items.map(item => {
      if (item.id === itemId) {

        if (item.remaining < 25) {
          alert("Not enough food");
          return item;
        }

        return {
          ...item,
          requests: [
            ...item.requests,
            {
              id: Date.now(),
              amount: 25,
              status: "pending"
            }
          ]
        };
      }
      return item;
    }));
  }

  // ✅ Approve Request (Fix Scenario 1)
  function approveRequest(itemId, reqId) {
    setItems(items.map(item => {
      if (item.id === itemId) {

        const req = item.requests.find(r => r.id === reqId);

        if (item.remaining < req.amount) {
          alert("Already taken!");
          return item;
        }

        return {
          ...item,
          remaining: item.remaining - req.amount,
          requests: item.requests.map(r =>
            r.id === reqId
              ? { ...r, status: "approved" }
              : r
          )
        };
      }
      return item;
    }));
  }

  // ⏳ Expire Unused (Scenario 2)
  function expireRequests(itemId) {
    setItems(items.map(item => {
      if (item.id === itemId) {

        const returnedAmount = item.requests
          .filter(r => r.status === "approved")
          .reduce((sum, r) => sum + r.amount, 0);

        return {
          ...item,
          remaining: item.remaining + returnedAmount,
          requests: item.requests.map(r =>
            r.status === "approved"
              ? { ...r, status: "expired" }
              : r
          )
        };
      }
      return item;
    }));
  }

  // 🧹 Correct Inventory (Scenario 4)
  function correctFood(itemId) {
    const value = prompt("Enter correct %");

    if (value === null) return;

    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          remaining: Number(value),
          requests: []
        };
      }
      return item;
    }));
  }

  return (
  <div style={styles.container}>
    <h1 style={styles.title}>🍕 FridgePolice</h1>

    {/* Add Food */}
    <div style={styles.addBox}>
      <input
        style={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter food name..."
      />
      <button style={styles.addBtn} onClick={addItem}>
        Add
      </button>
    </div>

    {/* Items */}
    {items.length === 0 && <p>No food items yet</p>}

    {items.map((item) => (
      <div key={item.id} style={styles.card}>
        <h3>
          {item.name} <span style={styles.id}>#{item.id}</span>
        </h3>

        <p style={styles.remaining}>
          Remaining: <b>{item.remaining}%</b>
        </p>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button
            style={styles.requestBtn}
            onClick={() => requestFood(item.id)}
          >
            Request 25%
          </button>

          <button
            style={styles.expireBtn}
            onClick={() => expireRequests(item.id)}
          >
            Expire
          </button>

          <button
            style={styles.fixBtn}
            onClick={() => correctFood(item.id)}
          >
            Fix
          </button>
        </div>

        {/* Requests */}
        <div style={styles.requests}>
          <h4>Requests</h4>

          {item.requests.length === 0 && <p>No requests</p>}

          {item.requests.map((req) => (
            <div key={req.id} style={styles.requestItem}>
              <span>
                {req.amount}% -{" "}
                <b style={statusColor(req.status)}>
                  {req.status}
                </b>
              </span>

              {req.status === "pending" && (
                <button
                  style={styles.approveBtn}
                  onClick={() =>
                    approveRequest(item.id, req.id)
                  }
                >
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
}

export default App;




const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
    background: "#f5f7fa",
    minHeight: "100vh"
  },
  title: {
    textAlign: "center"
  },
  addBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center"
  },
  input: {
    padding: "8px",
    width: "200px"
  },
  addBtn: {
    padding: "8px 12px",
    background: "#4CAF50",
    color: "white",
    border: "none"
  },
  card: {
    background: "white",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  id: {
    fontSize: "12px",
    color: "gray"
  },
  remaining: {
    margin: "5px 0"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    margin: "10px 0"
  },
  requestBtn: {
    background: "#2196F3",
    color: "white",
    border: "none",
    padding: "5px 10px"
  },
  expireBtn: {
    background: "#FF9800",
    color: "white",
    border: "none",
    padding: "5px 10px"
  },
  fixBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px"
  },
  approveBtn: {
    marginLeft: "10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    padding: "3px 8px"
  },
  requests: {
    marginTop: "10px"
  },
  requestItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px"
  }
};

function statusColor(status) {
  if (status === "approved") return { color: "green" };
  if (status === "pending") return { color: "orange" };
  if (status === "expired") return { color: "gray" };
  return { color: "red" };
}