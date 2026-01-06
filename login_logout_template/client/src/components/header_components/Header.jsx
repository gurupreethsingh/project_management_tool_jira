// src/components/header_components/Header.jsx
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";

const HERO_BG_DEFAULT =
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2400&q=70";

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

// ---- helpers (no external deps) ----
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function getInitials(name = "User") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "U";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

export default function Header({
  isLoggedIn = false,
  user = { name: "User", avatarUrl: "" },
  onLogout = () => {},
  currentPath = "",

  // ✅ NEW: per-page hero content
  heroTitle = "Elevating Ambitions, Powering Success,\nYour Strategic Partner For Success.",
  heroSubtitle = "We build AI-driven products, modern web & mobile applications, automation-first systems, software testing tool development, and secure blockchain solutions—crafted to scale with your business.",
  heroBg = HERO_BG_DEFAULT,
  showHero = true,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = useMemo(
    () => [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about-us" },
      { name: "Solutions", href: "/solutions" },
      { name: "AI/ML", href: "/ai-ml" },
      { name: "Technology", href: "/technology" },
      { name: "ERP", href: "/erp" },
      { name: "Cyber Security", href: "/cyber-security" },
      { name: "UI/UX-Design", href: "/ui-ux" },
      { name: "Digital Transformation", href: "/digital-transformation" },
      { name: "Contact", href: "/contact" },
    ],
    []
  );

  const isActive = (href) => {
    if (!currentPath || !href || href === "#") return false;
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  const linkBase = "text-sm/6 font-medium tracking-tight transition-colors";
  const linkInactive = "text-white/90 hover:text-white";
  const linkActive = "text-white";

  return (
    <header
      className={classNames(
        "relative overflow-hidden",
        "rounded-br-[110px] sm:rounded-br-[140px]",
        "[font-family:ui-sans-serif,system-ui,-apple-system,Segoe_UI,Roboto,Inter,Helvetica,Arial,'Apple_Color_Emoji','Segoe_UI_Emoji']"
      )}
      style={
        showHero
          ? {
              backgroundImage: `url(${heroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* background overlay only when hero is shown */}
      {showHero && <div className="absolute inset-0 bg-indigo-800/75" />}

      {/* NAV */}
      <div
        className={classNames(
          "relative z-10",
          showHero
            ? scrolled
              ? "bg-black/10 backdrop-blur-sm"
              : "bg-transparent"
            : scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm"
            : "bg-white shadow"
        )}
      >
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-9xl items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">ECODERS</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                className={classNames(
                  "h-8 w-auto",
                  showHero ? "brightness-0 invert" : ""
                )}
              />
            </a>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={classNames(
                "-m-2.5 inline-flex items-center justify-center rounded-md p-2.5",
                showHero
                  ? "text-white/90 hover:text-white"
                  : "text-gray-700 hover:text-indigo-700"
              )}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <PopoverGroup className="hidden lg:flex lg:gap-x-8">
            <Popover className="relative">
              <PopoverButton
                className={classNames(
                  "flex items-center gap-x-1",
                  linkBase,
                  showHero
                    ? linkInactive
                    : "text-gray-900 hover:text-indigo-700"
                )}
              >
                Product
                <ChevronDownIcon
                  aria-hidden="true"
                  className={classNames(
                    "size-5 flex-none",
                    showHero ? "text-white/70" : "text-gray-400"
                  )}
                />
              </PopoverButton>

              <PopoverPanel
                transition
                className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
              >
                <div className="p-4">
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                    >
                      <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          aria-hidden="true"
                          className="size-6 text-gray-600 group-hover:text-indigo-700"
                        />
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-900 group-hover:text-indigo-700"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100 hover:text-indigo-700"
                    >
                      <item.icon
                        aria-hidden="true"
                        className="size-5 flex-none text-gray-400"
                      />
                      {item.name}
                    </a>
                  ))}
                </div>
              </PopoverPanel>
            </Popover>

            {navLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className={classNames(
                  linkBase,
                  showHero
                    ? isActive(l.href)
                      ? linkActive
                      : linkInactive
                    : isActive(l.href)
                    ? "text-indigo-700"
                    : "text-gray-900 hover:text-indigo-700"
                )}
              >
                {l.name}
              </a>
            ))}
          </PopoverGroup>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {!isLoggedIn ? (
              <a
                href="/login"
                className={classNames(
                  linkBase,
                  showHero
                    ? linkInactive
                    : "text-gray-900 hover:text-indigo-700",
                  "font-semibold"
                )}
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            ) : (
              <Menu as="div" className="relative">
                <MenuButton
                  className={classNames(
                    "group inline-flex items-center gap-3 rounded-full px-2 py-1.5 text-sm font-semibold focus:outline-none",
                    showHero
                      ? "text-white hover:text-white focus-visible:ring-2 focus-visible:ring-white/30"
                      : "text-gray-900 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-600/40"
                  )}
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user?.name || "User"}
                      className={classNames(
                        "h-9 w-9 rounded-full object-cover ring-1",
                        showHero ? "ring-white/20" : "ring-gray-900/10"
                      )}
                    />
                  ) : (
                    <div
                      className={classNames(
                        "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-1",
                        showHero
                          ? "bg-white/15 text-white ring-white/20"
                          : "bg-gray-100 text-gray-700 ring-gray-900/10"
                      )}
                    >
                      {getInitials(user?.name)}
                    </div>
                  )}

                  <span className="max-w-[160px] truncate">{user?.name}</span>

                  <ChevronDownIcon
                    className={classNames(
                      "size-5",
                      showHero
                        ? "text-white/70 group-hover:text-white"
                        : "text-gray-400 group-hover:text-indigo-700"
                    )}
                    aria-hidden="true"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-20 mt-3 w-48 origin-top-right overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/10 focus:outline-none transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-120 data-leave:ease-in"
                >
                  <div className="p-1.5">
                    <MenuItem>
                      {({ active }) => (
                        <a
                          href="/profile"
                          className={classNames(
                            "block rounded-xl px-3 py-2 text-sm font-medium",
                            active
                              ? "bg-gray-50 text-indigo-700"
                              : "text-gray-900"
                          )}
                        >
                          Profile
                        </a>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <a
                          href="/dashboard"
                          className={classNames(
                            "block rounded-xl px-3 py-2 text-sm font-medium",
                            active
                              ? "bg-gray-50 text-indigo-700"
                              : "text-gray-900"
                          )}
                        >
                          Dashboard
                        </a>
                      )}
                    </MenuItem>

                    <div className="my-1.5 h-px bg-gray-100" />

                    <MenuItem>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={onLogout}
                          className={classNames(
                            "w-full rounded-xl px-3 py-2 text-left text-sm font-medium",
                            active
                              ? "bg-gray-50 text-indigo-700"
                              : "text-gray-900"
                          )}
                        >
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            )}
          </div>
        </nav>
      </div>

      {/* ✅ HERO (ONLY HERE). Pages should NOT add another hero below. */}
      {showHero && (heroTitle || heroSubtitle) && (
        <section className="relative z-10">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="py-24 sm:py-28 lg:py-32 text-center">
              <h1 className="mx-auto  text-balance text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl whitespace-pre-line">
                {heroTitle}
              </h1>

              <div className="mx-auto mt-10 h-[3px] w-40 sm:w-56 bg-white/80" />

              <p className="mx-auto mt-8 max-w-3xl text-pretty text-sm leading-7 text-white/90 sm:text-base">
                {heroSubtitle}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* MOBILE DRAWER */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">ECODERS</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:text-indigo-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 hover:text-indigo-700">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-open:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50 hover:text-indigo-700"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                {navLinks.map((l) => (
                  <a
                    key={l.name}
                    href={l.href}
                    className={classNames(
                      "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold",
                      isActive(l.href)
                        ? "text-indigo-700"
                        : "text-gray-900 hover:bg-gray-50 hover:text-indigo-700"
                    )}
                  >
                    {l.name}
                  </a>
                ))}
              </div>

              <div className="py-6 space-y-2">
                {!isLoggedIn ? (
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 hover:text-indigo-700"
                  >
                    Log in
                  </a>
                ) : (
                  <Fragment>
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user?.name || "User"}
                          className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-900/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 ring-1 ring-gray-900/10">
                          {getInitials(user?.name)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {user?.name}
                        </div>
                        <div className="text-xs text-gray-500">Signed in</div>
                      </div>
                    </div>

                    <a
                      href="/profile"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 hover:text-indigo-700"
                    >
                      Profile
                    </a>
                    <a
                      href="/dashboard"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 hover:text-indigo-700"
                    >
                      Dashboard
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout?.();
                      }}
                      className="-mx-3 w-full rounded-lg px-3 py-2.5 text-left text-base/7 font-semibold text-gray-900 hover:bg-gray-50 hover:text-indigo-700"
                    >
                      Logout
                    </button>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
