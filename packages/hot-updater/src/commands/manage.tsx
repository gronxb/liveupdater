import { serve } from "@hono/node-server";
import app from "@hot-updater/server";
import { Box, Text } from "ink";
import { useEffect } from "react";

console.log(app);
export default function Manage() {
  useEffect(() => {
    serve(
      {
        ...app,
        port: 3000,
      },
      async (info) => {
        console.log(`🚀 Server started on port ${info.port}`);
      },
    );
  }, []);

  return (
    <Box>
      <Text>Manage</Text>
    </Box>
  );
}
