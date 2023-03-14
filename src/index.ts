import { Hono } from "hono";

type Bindings = {
  AnwamNS: KVNamespace;
};

type User = {
  username: string;
  name: string;
  address: string;
  bio: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// app.use("*", poweredBy());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/user/:username", async (c) => {
  const username = c.req.param("username");
  const userString = await c.env.AnwamNS.get(username);
  const user = JSON.parse(userString) as User;
  const message = user ? "success" : "user not found";
  return c.json({
    message,
    data: {
      user,
    },
  });
});

app.post("/user", async (c) => {
  const body = await c.req.json<User>();
  const userString = JSON.stringify(body);
  try {
    await c.env.AnwamNS.put(body.username, userString);
  } catch (error) {
    return c.json({
      message: "failed",
      error: error.message,
    });
  }

  return c.json(
    {
      message: "success",
      data: {
        user: body,
      },
    },
    201
  );
});

export default app;
