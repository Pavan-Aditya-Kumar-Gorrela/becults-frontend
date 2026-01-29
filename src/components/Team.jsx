const Team = () => {
  return (
    <>
      <style>
        {`
                  @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
                  *{
                  font-family: "Poppins", sans-serif;
                  }`}
      </style>

      <section className="bg-black text-white py-16 px-6 md:px-16 lg:px-24 xl:px-32 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <h2 className="text-center lg:text-left text-4xl md:text-5xl/16 max-w-lg leading-tight">
              Meet the team shaping the future.
            </h2>
            <p className="text-center lg:text-left text-sm text-gray-100 max-w-md">
              Our diverse team of engineers, designers and innovators is
              dedicated to building AI agents that simplify work and empower
              businesses worldwide.
            </p>
            <button className="text-sm text-slate-50 rounded-full bg-indigo-500 hover:bg-indigo-600 px-4 py-2 mt-2">
              Join our team
            </button>
          </div>

          {/* Right Content - Image Gallery */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
            {/* Column 1 */}
            <div className="flex flex-col gap-4 pt-12">
              <img
                className="w-35 h-42 rounded-2xl transform transition hover:-translate-y-1"
                src={
                  'https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?q=80&w=735&auto=format&fit=crop'
                }
                alt="Team Member 1"
              />
              <img
                className="w-35 h-42 rounded-2xl transform transition hover:-translate-y-1"
                src={
                  'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=764&auto=format&fit=crop'
                }
                alt="Team Member 5"
              />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <img
                className="w-35 h-42 rounded-2xl transform transition hover:-translate-y-1"
                src={
                  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=687&auto=format&fit=crop'
                }
                alt="Team Member 2"
              />
              <img
                className="w-35 h-42 rounded-2xl transform transition hover:-translate-y-1"
                src={
                  'https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=687&auto=format&fit=crop'
                }
                alt="Team Member 4"
              />
              <img
                className="w-35 h-42 rounded-2xl transform transition hover:-translate-y-1"
                src={
                  'https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?q=80&w=735&auto=format&fit=crop'
                }
                alt="Team Member 1"
              />
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-4 pt-8">
              <img
                className="w-35 h-42 rounded-2xl transform transition hover:-translate-y-1"
                src={
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop'
                }
                alt="Team Member 3"
              />
              <img
                className="w-35 h-42 rounded-2xl transform transition hover:-translate-y-1"
                src={
                  'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=764&auto=format&fit=crop'
                }
                alt="Team Member 5"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;
