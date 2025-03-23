import Link from "next/link";

const ContactUs = () => {
  return (
    <div className="min-h-full text-black dark:text-white mt-10">
      <div className="w-full flex overflow-hidden overflow-y-auto mt-8">
        <div className="flex flex-col gap-8 rounded-lg">
          <h1 className="text-2xl font-semibold underline underline-offset-4">
            Help & Support
          </h1>

          <p className="">
            At Supranostik, we handle all software-related queries, providing
            tailored solutions to meet your specific needs. Whether it&apos;s
            troubleshooting, software customization (Web, Mobiile & Desktop
            applications), or anything in between, we&apos;re here to help..
          </p>

          {/* Contact Info Section */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-medium ">Contact Information:</h2>
              <p className="">Here&apos;s how you can get in touch with us.</p>
            </div>

            <div>
              <h3 className="text-md font-semibold text-orange-600">
                Supranostik
              </h3>
              <p className="">
                <span className="font-medium">Email: </span>
                Supranostik.connect@gmail.com
              </p>
              <p className="">
                <span className="font-medium">Phone: </span>+91 7797063266
              </p>
            </div>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-end px-3 ">
            <Link href="https://appariumnewapp.vercel.app/" target="_blank">
              <span className="hidden md:block ml-2 mt-2 text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                Created and Developed by{" "}
                <strong className="text-black dark:text-white">
                  Supranostik
                </strong>
                , 2024
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
