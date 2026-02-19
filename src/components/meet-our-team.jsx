import Navbar from "./navbar";
import Footer from "./footer";
import SectionTitle from "./section-title";
import Trishanth from "../assets/trishanth.jpeg";
import RamCharan from "../assets/ramcharan.png";
import Pranav from "../assets/pranav.jpeg";
import Ishvar from "../assets/ishvar.jpeg";
import Gayaz from "../assets/gayaz.jpeg";
import Vishnu from "../assets/admin_model.png"
export default function MeetOurTeam() {
  return (
      <>
      
       <br/> 
          <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          
              * {
                  font-family: 'Poppins', sans-serif;
              }
          `}</style>
          
      <SectionTitle
        title="Meet Our Team"
        description="The people behind the idea, passionate about who they are."
      />

      {/* First row - 3 cards */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
        <div className="w-72 bg-black text-white rounded-2xl flex-shrink-0">
                  <div className="relative -mt-px overflow-hidden rounded-2xl">
                      <img src={Trishanth} alt="" className="h-[400px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top" />
                      <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                  </div>
          <div className="px-4 pb-6 text-center">
            <p className="mt-4 text-lg">Trishanth</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">
            Enthusiastic towards Graphic Designing
            </p>
          </div>
        </div>
        <div className="w-72 bg-black text-white rounded-2xl flex-shrink-0">
                  <div className="relative -mt-px overflow-hidden rounded-2xl">
                      <img src={Ishvar} alt="" className="h-[400px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top" />
                      <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                  </div>
          <div className="px-4 pb-6 text-center">
            <p className="mt-4 text-lg">Ishvar</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">
            Enthusiastic towards Frontend Development
            </p>
          </div>
        </div>
        <div className="w-72 bg-black text-white rounded-2xl flex-shrink-0">
                  <div className="relative -mt-px overflow-hidden rounded-2xl">
                      <img src={Pranav} alt="" className="h-[400px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top" />
                      <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                  </div>
          <div className="px-4 pb-6 text-center">
            <p className="mt-4 text-lg">Pranav</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">
            Enthusiastic towards Backend Development
            </p>
          </div>
        </div>
      </div>

      {/* Second row - 2 cards */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
        <div className="w-72 bg-black text-white rounded-2xl flex-shrink-0">
                  <div className="relative -mt-px overflow-hidden rounded-2xl">
                      <img src={Gayaz} alt="" className="h-[400px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top" />
                      <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                  </div>
          <div className="px-4 pb-6 text-center">
            <p className="mt-4 text-lg">Gayaz</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">
            Enthusiastic towards Machine Learning
            </p>
          </div>
        </div>

        <div className="w-72 bg-black text-white rounded-2xl flex-shrink-0">
                  <div className="relative -mt-px overflow-hidden rounded-2xl">
                      <img src={RamCharan} alt="" className="h-[400px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top" />
                      <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                  </div>
          <div className="px-4 pb-6 text-center">
            <p className="mt-4 text-lg">Ram Charan</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">
            Enthusiastic towards Backend Development
            </p>
          </div>
        </div>

        <div className="w-72 bg-black text-white rounded-2xl flex-shrink-0">
                  <div className="relative -mt-px overflow-hidden rounded-2xl">
                      <img src={Vishnu} alt="" className="h-[400px] w-full rounded-2xl hover:scale-105 transition-all duration-300 object-cover object-top" />
                      <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                  </div>
          <div className="px-4 pb-6 text-center">
            <p className="mt-4 text-lg">Vishnu</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">
            Enthusiastic towards Web Development
            </p>
          </div>
        </div>

      </div>

      <Footer/>
      </>
  );
};