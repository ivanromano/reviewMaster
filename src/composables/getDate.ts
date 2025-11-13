const getDate = (text:string) => {
  if (text === "now") return "today"

  const date = new Date(text);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export default getDate