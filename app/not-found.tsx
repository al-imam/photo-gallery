import { NotFound } from "$components/not-found/not-found";

export const metadata = {
  title: "Not Found",
  description: "You're lost in the web",
};

export default function NotFoundPage() {
  return <NotFound />;
}
