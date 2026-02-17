import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RestaurantCard from "./RestaurantCard";
import { Restaurant } from "@/lib/types";

// Mock next/image to render a plain img
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}));


const baseRestaurant: Restaurant = {
  id: "1",
  name: "Test Restaurant",
  rating: 4.5,
  filter_ids: ["e1d72f68-77d2-4d18-b323-878984b60e12"],
  image_url: "/test-image.jpg",
  delivery_time_minutes: 25,
  price_range_id: "d09ff4c9-e90e-42c7-b78b-bdc65e3331ce",
};

describe("RestaurantCard", () => {
  describe("basic rendering", () => {
    it("renders the restaurant name", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: true }} />,
      );
      expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    });

    it("renders the restaurant image", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: true }} />,
      );
      const img = screen.getByAltText("Test Restaurant");
      expect(img).toHaveAttribute("src", "/test-image.jpg");
    });

    it("renders an arrow button with accessible label", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: true }} />,
      );
      expect(
        screen.getByRole("button", { name: "View Test Restaurant" }),
      ).toBeInTheDocument();
    });
  });

  describe("open/closed status", () => {
    it("shows 'Open' badge when restaurant is open", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: true }} />,
      );
      expect(screen.getByText("Open")).toBeInTheDocument();
    });

    it("shows 'Closed' badge when restaurant is closed", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: false }} />,
      );
      expect(screen.getByText("Closed")).toBeInTheDocument();
    });

    it("shows no open/closed badge when is_open is undefined", () => {
      render(<RestaurantCard restaurant={baseRestaurant} />);
      expect(screen.queryByText("Open")).not.toBeInTheDocument();
      expect(screen.queryByText("Closed")).not.toBeInTheDocument();
    });

    it("shows 'Opens tomorrow at 12 pm' when closed", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: false }} />,
      );
      expect(
        screen.getByText("Opens tomorrow at 12 pm"),
      ).toBeInTheDocument();
    });

    it("does not show closed message when open", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: true }} />,
      );
      expect(
        screen.queryByText("Opens tomorrow at 12 pm"),
      ).not.toBeInTheDocument();
    });

    it("applies closed class when restaurant is closed", () => {
      const { container } = render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: false }} />,
      );
      const className = (container.firstChild as HTMLElement).className;
      expect(className).toContain("closed");
    });

    it("does not apply closed class when restaurant is open", () => {
      const { container } = render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: true }} />,
      );
      const className = (container.firstChild as HTMLElement).className;
      expect(className).not.toContain("closed");
    });
  });

  describe("delivery time badge", () => {
    it("shows delivery time when restaurant is open", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: true }} />,
      );
      expect(screen.getByText("25-30 min")).toBeInTheDocument();
    });

    it("does not show delivery time when restaurant is closed", () => {
      render(
        <RestaurantCard restaurant={{ ...baseRestaurant, is_open: false }} />,
      );
      expect(screen.queryByText("25-30 min")).not.toBeInTheDocument();
    });

    it("does not show delivery time when is_open is undefined", () => {
      render(<RestaurantCard restaurant={baseRestaurant} />);
      expect(screen.queryByText("25-30 min")).not.toBeInTheDocument();
    });
  });

  describe("formatDeliveryTime", () => {
    it("formats time under 60 minutes as a 5-min range", () => {
      render(
        <RestaurantCard
          restaurant={{
            ...baseRestaurant,
            is_open: true,
            delivery_time_minutes: 12,
          }}
        />,
      );
      expect(screen.getByText("10-15 min")).toBeInTheDocument();
    });

    it("formats exactly 60 minutes as '1 hour'", () => {
      render(
        <RestaurantCard
          restaurant={{
            ...baseRestaurant,
            is_open: true,
            delivery_time_minutes: 60,
          }}
        />,
      );
      expect(screen.getByText("1 hour")).toBeInTheDocument();
    });

    it("formats 120 minutes as '2 hours'", () => {
      render(
        <RestaurantCard
          restaurant={{
            ...baseRestaurant,
            is_open: true,
            delivery_time_minutes: 120,
          }}
        />,
      );
      expect(screen.getByText("2 hours")).toBeInTheDocument();
    });

    it("formats 90 minutes as '1 hour' (floors to whole hours)", () => {
      render(
        <RestaurantCard
          restaurant={{
            ...baseRestaurant,
            is_open: true,
            delivery_time_minutes: 90,
          }}
        />,
      );
      expect(screen.getByText("1 hour")).toBeInTheDocument();
    });

    it("formats 0 minutes as '0-5 min'", () => {
      render(
        <RestaurantCard
          restaurant={{
            ...baseRestaurant,
            is_open: true,
            delivery_time_minutes: 0,
          }}
        />,
      );
      expect(screen.getByText("0-5 min")).toBeInTheDocument();
    });

    it("formats a value exactly on a 5-min boundary", () => {
      render(
        <RestaurantCard
          restaurant={{
            ...baseRestaurant,
            is_open: true,
            delivery_time_minutes: 30,
          }}
        />,
      );
      expect(screen.getByText("30-35 min")).toBeInTheDocument();
    });
  });
});
