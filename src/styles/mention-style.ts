const mentionStyle = {
  control: {
    backgroundColor: "#18181b", // zinc-900
    border: "1px solid #3f3f46", // zinc-700
    color: "white",
    fontSize: 14,
    padding: "6px 8px",
    borderRadius: 6,
  },
  "&multiLine": {
    control: {
      minHeight: 40,
    },
    highlighter: {
      padding: 9,
    },
    input: {
      padding: 9,
    },
  },
  suggestions: {
    list: {
      backgroundColor: "#27272a", // zinc-800
      border: "1px solid #3f3f46",
      fontSize: 14,
    },
    item: {
      padding: "5px 10px",
      borderBottom: "1px solid #3f3f46",
      "&focused": {
        backgroundColor: "#3f3f46",
      },
    },
  },
};

export default mentionStyle;
