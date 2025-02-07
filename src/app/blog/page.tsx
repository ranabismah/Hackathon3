import React from 'react';
import Image from 'next/image';
import CustomerCare from '@/components/CustomerCare';

const Blog = () => {
  return (
    <>
      <section className="min-h-full w-full flex flex-col items-center">
        {/* Banner */}
        <div className="h-full md:h-[316px] w-full flex flex-col items-center justify-center">
          <div className="h-[316px] relative w-full">
            <Image src="/shop/shop-hero.png" alt="hero" fill style={{ objectFit: 'cover' }} />
            <div className="w-[150px] md:w-[124px] absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] h-[90%] flex flex-col justify-center items-center">
              <h1 className="font-medium text-4xl text-black">Blog</h1>
              <p className="font-normal text-[16px] text-mygray">home &gt; Blog</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full max-w-screen-xl py-12 px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* About Information */}
            <div className="flex-1 space-y-8">
              {/* About Sections */}
              {[
                {
                  image: '/image1.png',
                  tag: '/tag1.png',
                  title: 'Our Vision and Mission',
                  description:
                    'We aim to bring innovative solutions to everyday problems and improve the quality of life. Our commitment to quality and sustainability drives everything we do.',
                },
                {
                  image: '/image2.png',
                  tag: '/tag2.png',
                  title: 'Our Values',
                  description:
                    'At the heart of our company lies a strong belief in honesty, sustainability, and creativity. We value hard work, dedication, and the ability to adapt to new challenges.',
                },
                {
                  image: '/image3.png',
                  tag: '/tag1.png',
                  title: 'Our History',
                  description:
                    'Founded in [year], our company has continuously evolved, always looking for better ways to serve our community. Over the years, we have grown from a small startup to an industry leader.',
                },
              ].map((section, index) => (
                <div key={index} className="relative">
                  <Image src={section.image} alt="about" width={1440} height={800} layout="responsive" />
                  <Image className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pt-2" src={section.tag} alt="tag" width={349} height={24} />
                  <h2 className="text-2xl font-medium text-myblack mt-4">{section.title}</h2>
                  <p className="text-base text-mygray">{section.description}</p>
                  <button className="w-[120px] h-[36px] mt-4 pt-4 border-b-2 border-myblack text-[16px] font-semibold text-myblack">
                    Read More
                  </button>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-[300px] space-y-8">
              {/* Search Bar */}
              <div className="h-[58px] w-full flex border-2 border-myblack rounded-md items-center justify-between px-2">
                <input type="text" placeholder="Search" className="w-full h-full pl-2 text-myblack text-sm outline-none" />
                <Image src="/searchbar.png" alt="search icon" width={19} height={19} />
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h2 className="text-2xl font-medium text-myblack">Categories</h2>
                {['Crafts', 'Design', 'Handmade', 'Interior', 'Wood'].map((category, index) => (
                  <div key={index} className="flex justify-between">
                    <p className="text-base text-myblack">{category}</p>
                    <p className="text-base text-mygray">{Math.floor(Math.random() * 10)}</p>
                  </div>
                ))}
              </div>

              {/* Recent Updates */}
              <div className="space-y-4">
                <h2 className="text-2xl font-medium text-myblack">Recent Updates</h2>
                {[
                  { image: '/post1.png', title: 'Expanding our horizons', date: '03 Aug 2022' },
                  { image: '/post2.png', title: 'Sustainability initiatives', date: '03 Aug 2022' },
                  { image: '/post3.png', title: 'Handmade pieces that took time to make', date: '03 Aug 2022' },
                  { image: '/post4.png', title: 'Modern home in Milan', date: '03 Aug 2022' },
                  { image: '/post5.png', title: 'Colorful office redesign', date: '03 Aug 2022' },
                ].map((post, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <Image src={post.image} alt="update" width={80} height={80} />
                    <div>
                      <h3 className="text-sm text-myblack">{post.title}</h3>
                      <p className="text-xs text-mygray">{post.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="h-[32px] w-full flex justify-center space-x-4 mt-8">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-[60px] w-[60px] flex justify-center items-center border-2 rounded-md ${
                  num === 1
                    ? 'bg-golden text-white border-golden hover:bg-white hover:text-myblack'
                    : 'bg-white text-myblack hover:bg-golden hover:text-white border-golden'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CustomerCare />
    </>
  );
};

export default Blog;
