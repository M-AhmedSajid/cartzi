import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";

export const getMenuForHeader = async () => {
  const HEADER_MENU_QUERY = defineQuery(`*[_type == "menu" && location == "header"][0]{
    title,
    items[]{
      "label": coalesce(
      title,
      category->name,
      select(
        page == "/" => "Home",
        page == "/about" => "About Us",
        page == "/contact" => "Contact Us",
        page == "/terms-and-conditions" => "Terms & Conditions",
        page == "/privacy-policy" => "Privacy Policy",
        page == "/shipping-returns" => "Shipping & Returns",
        page == "/faqs" => "FAQs",
        page
      )
    ),
    "href": select(
      linkType == "category" => "/category/" + category->slug.current,
      linkType == "page" => page
    ),
      "children": select(
        linkType == "category" => category->{
          "items": *[_type == "category" && parent._ref == ^._id]{
            name,
            "href": "/category/" + slug.current
          }
        }
      )
    }
  }`);
  try {
    const menuForHeader = await sanityFetch({
      query: HEADER_MENU_QUERY,
    });
    return menuForHeader?.data || [];
  } catch (error) {
    console.error("Error fetching menu for header:", error);
  }
};

export const getMenuForFooter1 = async () => {
  const FOOTER1_MENU_QUERY = defineQuery(`*[_type == "menu" && location == "footer-1"][0]{
      title,
      items[]{
        "label": coalesce(
          title,
          category->name,
          select(
            page == "/" => "Home",
            page == "/about" => "About Us",
            page == "/contact" => "Contact Us",
            page == "/terms-and-conditions" => "Terms & Conditions",
            page == "/privacy-policy" => "Privacy Policy",
            page == "/shipping-returns" => "Shipping & Returns",
            page == "/faqs" => "FAQs",
            page
          )
        ),
        "href": select(
          linkType == "category" => "/category/" + category->slug.current,
          linkType == "page" => page
        )
      }
    }`);

  try {
    const menuForFooter1 = await sanityFetch({
      query: FOOTER1_MENU_QUERY,
    });
    return menuForFooter1?.data || [];
  } catch (error) {
    console.error("Error fetching menu for footer-1:", error);
  }
};

export const getMenuForFooter2 = async () => {
  const FOOTER2_MENU_QUERY = defineQuery(`*[_type == "menu" && location == "footer-2"][0]{
      title,
      items[]{
        "label": coalesce(
          title,
          category->name,
          select(
            page == "/" => "Home",
            page == "/about" => "About Us",
            page == "/contact" => "Contact Us",
            page == "/terms-and-conditions" => "Terms & Conditions",
            page == "/privacy-policy" => "Privacy Policy",
            page == "/shipping-returns" => "Shipping & Returns",
            page == "/faqs" => "FAQs",
            page
          )
        ),
        "href": select(
          linkType == "category" => "/category/" + category->slug.current,
          linkType == "page" => page
        )
      }
    }`);

  try {
    const menuForFooter2 = await sanityFetch({
      query: FOOTER2_MENU_QUERY,
    });
    return menuForFooter2?.data || [];
  } catch (error) {
    console.error("Error fetching menu for footer-2:", error);
  }
};

export const getMenuForMobileSidebar = async () => {
  const MOBILE_SIDEBAR_MENU_QUERY = defineQuery(`*[_type == "menu" && location in ["mobile-sidebar", "header"]]
    | order(location desc)[0]{
      title,
      items[]{
        "label": coalesce(
      title,
      category->name,
      select(
        page == "/" => "Home",
        page == "/about" => "About Us",
        page == "/contact" => "Contact Us",
        page == "/terms-and-conditions" => "Terms & Conditions",
        page == "/privacy-policy" => "Privacy Policy",
        page == "/shipping-returns" => "Shipping & Returns",
        page == "/faqs" => "FAQs",
        page
      )
    ),
    "href": select(
      linkType == "category" => "/category/" + category->slug.current,
      linkType == "page" => page
    ),
        "children": category->{
          "items": *[_type == "category" && parent._ref == ^._id]{
            name,
            "href": "/category/" + slug.current
          }
        }
      }
    }`);

  try {
    const menuForMobileSidebar = await sanityFetch({
      query: MOBILE_SIDEBAR_MENU_QUERY,
    });
    return menuForMobileSidebar?.data || [];
  } catch (error) {
    console.error("Error fetching menu for mobile sidebar:", error);
  }
};
