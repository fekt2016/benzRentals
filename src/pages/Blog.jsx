/* eslint-disable react/prop-types */
// src/pages/BlogPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  LuxuryCard, 
  Card 
} from '../components/Cards/Card';
import { 
  PrimaryButton, 
  SecondaryButton,
  
} from '../components/ui/Button';
import {
  LoadingState,
  EmptyState
} from '../components/ui/LoadingSpinner';
import { 
  FaCalendar, 
  FaUser, 
  FaTag, 
  FaArrowRight,
  FaSearch,
  FaShare,
  FaBookmark,
  FaClock
} from 'react-icons/fa';

// Mock blog data
const BLOG_POSTS = [
  {
    id: 1,
    title: "The Ultimate Guide to Luxury Car Rentals in 2024",
    excerpt: "Discover the latest trends in luxury car rentals and how to choose the perfect vehicle for your needs. From Mercedes-Benz S-Class to premium SUVs.",
    content: "Full content about luxury car rentals...",
    author: "Sarah Chen",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Luxury Travel",
    tags: ["Mercedes", "Luxury", "Guide"],
    image: "/images/ben44.jpeg",
    featured: true
  },
  {
    id: 2,
    title: "Why Mercedes-Benz Remains the Gold Standard in Rental Luxury",
    excerpt: "Exploring the timeless appeal and cutting-edge features that make Mercedes-Benz the preferred choice for luxury car rentals worldwide.",
    content: "Full content about Mercedes-Benz standards...",
    author: "Marcus Rodriguez",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Brand Insight",
    tags: ["Mercedes", "Quality", "Innovation"],
    image: "/images/glc2.jpg",
    featured: true
  },
  {
    id: 3,
    title: "Top 5 Road Trip Destinations Accessible with BenzFlex",
    excerpt: "Plan your next adventure with our curated list of breathtaking road trip destinations perfect for your luxury rental experience.",
    content: "Full content about road trip destinations...",
    author: "Emma Thompson",
    date: "2024-01-10",
    readTime: "10 min read",
    category: "Travel Tips",
    tags: ["Road Trip", "Adventure", "Destinations"],
    image: "/images/gclass1.jpg"
  },
  {
    id: 4,
    title: "The Economics of Luxury Car Rentals: Is It Worth It?",
    excerpt: "A comprehensive analysis of the costs and benefits of renting luxury vehicles versus ownership for occasional use.",
    content: "Full content about economics of rentals...",
    author: "David Park",
    date: "2024-01-08",
    readTime: "12 min read",
    category: "Industry Insights",
    tags: ["Economics", "Analysis", "Value"],
    image: "/images/Class1.avif"
  },
  {
    id: 5,
    title: "Maintaining Luxury: How We Keep Our Fleet in Perfect Condition",
    excerpt: "Behind the scenes at BenzFlex - our rigorous maintenance protocols and quality assurance processes.",
    content: "Full content about maintenance processes...",
    author: "Lisa Wang",
    date: "2024-01-05",
    readTime: "7 min read",
    category: "Behind the Scenes",
    tags: ["Maintenance", "Quality", "Fleet"],
    image: "/images/Class A Benz 1c.avif"
  },
  {
    id: 6,
    title: "Electric Luxury: The Future of Premium Rental Vehicles",
    excerpt: "Exploring BenzFlex's commitment to sustainability with our growing fleet of electric and hybrid luxury vehicles.",
    content: "Full content about electric luxury vehicles...",
    author: "James Wilson",
    date: "2024-01-03",
    readTime: "9 min read",
    category: "Sustainability",
    tags: ["Electric", "Future", "Sustainability"],
    image: "/images/cla3.jpg"
  }
];

const CATEGORIES = [
  "All Topics",
  "Luxury Travel",
  "Brand Insight",
  "Travel Tips",
  "Industry Insights",
  "Behind the Scenes",
  "Sustainability"
];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading,] = useState(false);

  // Filter posts based on category and search
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === "All Topics" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return <LoadingState message="Loading luxury insights..." />;
  }

  return (
    <BlogContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroBadge>BenzFlex Insights</HeroBadge>
            <HeroTitle>
              Luxury Travel <span className="gradient-text">Insights</span> & Stories
            </HeroTitle>
            <HeroDescription>
              Discover expert tips, industry insights, and inspiring stories from the world of luxury car rentals. 
              Your journey to exceptional travel experiences starts here.
            </HeroDescription>
          </motion.div>
        </HeroContent>
        <HeroGraphics>
          <HeroPattern />
        </HeroGraphics>
      </HeroSection>

      {/* Blog Content */}
      <BlogContent>
        {/* Search and Filter Section */}
        <FilterSection>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
          </SearchBox>
          
          <CategoryFilters>
            {CATEGORIES.map(category => (
              <CategoryButton
                key={category}
                $active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </CategoryButton>
            ))}
          </CategoryFilters>
        </FilterSection>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <FeaturedSection>
            <SectionHeader>
              <SectionTitle>Featured Stories</SectionTitle>
              <SectionSubtitle>Curated luxury insights and expert perspectives</SectionSubtitle>
            </SectionHeader>
            
            <FeaturedGrid>
              {featuredPosts.map((post, index) => (
                <FeaturedPostCard 
                  key={post.id}
                  post={post}
                  index={index}
                />
              ))}
            </FeaturedGrid>
          </FeaturedSection>
        )}

        {/* All Posts */}
        <PostsSection>
          <SectionHeader>
            <SectionTitle>Latest Articles</SectionTitle>
            <SectionSubtitle>Fresh perspectives on luxury travel and car rentals</SectionSubtitle>
          </SectionHeader>

          {filteredPosts.length === 0 ? (
            <EmptyState
              title="No articles found"
              message="Try adjusting your search or filter criteria"
              action={
                <PrimaryButton
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Topics");
                  }}
                >
                  Clear Filters
                </PrimaryButton>
              }
            />
          ) : (
            <PostsGrid>
              {regularPosts.map((post, index) => (
                <BlogPostCard 
                  key={post.id}
                  post={post}
                  index={index}
                />
              ))}
            </PostsGrid>
          )}
        </PostsSection>

        {/* Newsletter Section */}
        <NewsletterSection>
          <NewsletterCard>
            <NewsletterContent>
              <NewsletterTitle>
                Stay Updated with Luxury Insights
              </NewsletterTitle>
              <NewsletterDescription>
                Get the latest articles, exclusive deals, and luxury travel tips delivered to your inbox.
              </NewsletterDescription>
              <NewsletterForm>
                <NewsletterInput
                  type="email"
                  placeholder="Enter your email address"
                />
                <PrimaryButton $size="lg">
                  Subscribe <FaArrowRight />
                </PrimaryButton>
              </NewsletterForm>
              <NewsletterNote>
                No spam, unsubscribe at any time
              </NewsletterNote>
            </NewsletterContent>
          </NewsletterCard>
        </NewsletterSection>
      </BlogContent>
    </BlogContainer>
  );
};

// Featured Post Component
const FeaturedPostCard = ({ post, index }) => {
  return (
    <FeaturedCard
      as={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <FeaturedImage>
        <img src={post.image} alt={post.title} />
        <FeaturedBadge>Featured</FeaturedBadge>
      </FeaturedImage>
      
      <FeaturedContent>
        <PostMeta>
          <MetaItem>
            <FaUser />
            {post.author}
          </MetaItem>
          <MetaItem>
            <FaCalendar />
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </MetaItem>
          <MetaItem>
            <FaClock />
            {post.readTime}
          </MetaItem>
        </PostMeta>
        
        <PostTitle>{post.title}</PostTitle>
        <PostExcerpt>{post.excerpt}</PostExcerpt>
        
        <PostCategory>{post.category}</PostCategory>
        
        <PostActions>
          <PrimaryButton $size="sm">
            Read More <FaArrowRight />
          </PrimaryButton>
          <ActionIcons>
            <IconButton>
              <FaBookmark />
            </IconButton>
            <IconButton>
              <FaShare />
            </IconButton>
          </ActionIcons>
        </PostActions>
      </FeaturedContent>
    </FeaturedCard>
  );
};

// Regular Blog Post Component
const BlogPostCard = ({ post, index }) => {
  return (
    <PostCard
      as={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <PostImage>
        <img src={post.image} alt={post.title} />
      </PostImage>
      
      <PostContent>
        <PostMeta>
          <MetaItem>
            <FaCalendar />
            {new Date(post.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </MetaItem>
          <MetaItem>
            <FaClock />
            {post.readTime}
          </MetaItem>
        </PostMeta>
        
        <PostTitle $small>{post.title}</PostTitle>
        <PostExcerpt $small>{post.excerpt}</PostExcerpt>
        
        <PostTags>
          {post.tags.map(tag => (
            <Tag key={tag}>
              <FaTag />
              {tag}
            </Tag>
          ))}
        </PostTags>
        
        <PostActions $compact>
          <SecondaryButton $size="sm">
            Read Article <FaArrowRight />
          </SecondaryButton>
        </PostActions>
      </PostContent>
    </PostCard>
  );
};

// Styled Components
const BlogContainer = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

const HeroSection = styled.section`
  position: relative;
  background: var(--gradient-secondary);
  color: var(--white);
  padding: var(--space-3xl) 0;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  text-align: center;
  position: relative;
  z-index: 2;
`;

const HeroBadge = styled.div`
  display: inline-block;
  background: var(--gradient-primary);
  color: var(--white);
  padding: var(--space-xs) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xl);
`;

const HeroTitle = styled.h1`
  font-size: var(--text-6xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-lg);
  line-height: 1.1;
  
  @media ${props => props.theme.devices?.lg} {
    font-size: var(--text-5xl);
  }
  
  @media ${props => props.theme.devices?.md} {
    font-size: var(--text-4xl);
  }
`;

const HeroDescription = styled.p`
  font-size: var(--text-xl);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const HeroGraphics = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const HeroPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(92, 206, 251, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(251, 137, 92, 0.1) 0%, transparent 50%);
`;

const BlogContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg);
`;

const FilterSection = styled.div`
  margin-bottom: var(--space-2xl);
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto var(--space-xl);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--space-md) var(--space-xl);
  padding-right: 60px;
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(92, 206, 251, 0.1);
  }
  
  &::placeholder {
    color: var(--text-light);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: var(--space-lg);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: var(--text-lg);
`;

const CategoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
  align-items: center;
`;

const CategoryButton = styled.button`
  padding: var(--space-sm) var(--space-lg);
  background: ${props => props.$active ? 'var(--gradient-primary)' : 'transparent'};
  color: ${props => props.$active ? 'var(--white)' : 'var(--text-secondary)'};
  border: 2px solid ${props => props.$active ? 'transparent' : 'var(--gray-300)'};
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.$active ? 'transparent' : 'var(--primary)'};
    color: ${props => props.$active ? 'var(--white)' : 'var(--primary)'};
    transform: translateY(-1px);
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-2xl);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-4xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-sm);
  color: var(--secondary);
`;

const SectionSubtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
`;

const FeaturedSection = styled.section`
  margin-bottom: var(--space-3xl);
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-2xl);
  
  @media ${props => props.theme.devices?.md} {
    grid-template-columns: 1fr;
  }
`;

const FeaturedCard = styled(LuxuryCard)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const FeaturedImage = styled.div`
  position: relative;
  height: 280px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }
  
  ${FeaturedCard}:hover & img {
    transform: scale(1.05);
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: var(--space-lg);
  left: var(--space-lg);
  background: var(--gradient-accent);
  color: var(--white);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const FeaturedContent = styled.div`
  padding: var(--space-xl);
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PostsSection = styled.section`
  margin-bottom: var(--space-3xl);
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-xl);
  
  @media ${props => props.theme.devices?.sm} {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const PostImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }
  
  ${PostCard}:hover & img {
    transform: scale(1.05);
  }
`;

const PostContent = styled.div`
  padding: var(--space-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PostMeta = styled.div`
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--text-muted);
  
  svg {
    font-size: var(--text-xs);
  }
`;

const PostTitle = styled.h3`
  font-size: ${props => props.$small ? 'var(--text-xl)' : 'var(--text-2xl)'};
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-sm);
  line-height: 1.3;
  color: var(--secondary);
  
  ${PostCard}:hover & {
    color: var(--primary);
  }
`;

const PostExcerpt = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  flex: 1;
  font-size: ${props => props.$small ? 'var(--text-sm)' : 'var(--text-base)'};
`;

const PostCategory = styled.div`
  display: inline-block;
  background: var(--gradient-primary);
  color: var(--white);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-lg);
  align-self: flex-start;
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--gray-100);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  
  svg {
    font-size: 0.7em;
  }
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  
  ${props => props.$compact && `
    justify-content: flex-start;
  `}
`;

const ActionIcons = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-full);
  color: var(--text-muted);
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: var(--primary-light);
  }
`;

const NewsletterSection = styled.section`
  margin-top: var(--space-3xl);
`;

const NewsletterCard = styled(LuxuryCard)`
  background: var(--gradient-luxury);
  color: var(--white);
  text-align: center;
  padding: var(--space-3xl);
`;

const NewsletterContent = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const NewsletterTitle = styled.h3`
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-md);
  color: var(--white);
`;

const NewsletterDescription = styled.p`
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--space-xl);
  line-height: 1.6;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  
  @media ${props => props.theme.devices?.sm} {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
  
  &:focus {
    outline: none;
    border-color: var(--primary-light);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const NewsletterNote = styled.p`
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.6);
`;

export default BlogPage;