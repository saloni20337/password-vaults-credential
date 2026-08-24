function Footer() {
  return (
    <footer className="
      mt-10
      border-t
      border-[#30363d]
      bg-[#0d1117]
    ">

      <div className="
        mx-auto max-w-6xl
        px-4 py-5
        sm:px-6 lg:px-8

        flex flex-col
        gap-3

        sm:flex-row
        sm:items-center
        sm:justify-between
      ">


        <div>

          <p className="
            text-sm
            font-semibold
            text-white
          ">
            Password Vault
          </p>


          <p className="
            mt-1
            text-xs
            text-slate-400
          ">
            Securely manage your credentials.
          </p>

        </div>





        <div className="
          flex items-center
          gap-4

          text-sm
          text-slate-400
        ">


          <span className="
            flex items-center
            gap-2
          ">

            <span className="
              h-2 w-2
              rounded-full
              bg-emerald-500
            "/>

            Secure Vault

          </span>



          <span>
            © {new Date().getFullYear()}
          </span>


        </div>


      </div>


    </footer>
  );
}


export default Footer;