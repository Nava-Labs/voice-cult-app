-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address VARCHAR NOT NULL,
  token_address VARCHAR NOT NULL,
  token_details JSONB,
  total_points_allocated BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create voice_logs table
CREATE TABLE voice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_address VARCHAR NOT NULL,
  voice_url VARCHAR NOT NULL,
  is_played BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create point_logs table
CREATE TABLE point_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address VARCHAR NOT NULL,
  projects_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  point_earned NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Get all users sum points all time
CREATE OR REPLACE FUNCTION get_tapper_info(user_address_input VARCHAR)
RETURNS TABLE (
  total_points NUMERIC,
  limit_left NUMERIC,
  voice_left NUMERIC,
  extra_points NUMERIC,
  total_limit_left NUMERIC
) AS $$
DECLARE
  total_points NUMERIC;
  limit_left NUMERIC;
  voice_left NUMERIC;
  extra_point NUMERIC;
BEGIN
  -- Total points earned by the user
  SELECT COALESCE(SUM(point_earned), 0)
  INTO total_points
  FROM point_logs
  WHERE user_address = user_address_input;

  -- Calculate the remaining points for today
  SELECT 1000 - COALESCE(SUM(point_earned), 0)
  INTO limit_left
  FROM point_logs
  WHERE user_address = user_address_input
    AND created_at BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 second';

  -- Calculate the remaining voices for today
  SELECT 10 - COALESCE(COUNT(*), 0)
  INTO voice_left
  FROM voice_logs
  WHERE user_address = user_address_input
    AND created_at BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 second';

  -- Calculate the extra point from voices for today
  SELECT 50 * COALESCE(COUNT(*), 0)
  INTO extra_point
  FROM voice_logs
  WHERE user_address = user_address_input
    AND created_at BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 second';

  RETURN QUERY
  SELECT total_points, limit_left, voice_left, extra_point, (limit_left + extra_point);
END;
$$ LANGUAGE plpgsql;

-- Get users all projects
CREATE OR REPLACE FUNCTION get_tapper_in_projects(user_address_input VARCHAR, limit_data NUMERIC)
RETURNS TABLE (
  project_id UUID,
  token_address VARCHAR,
  token_details JSONB,
  total_points NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS project_id,
    p.token_address,
    p.token_details,
    COALESCE(SUM(pl.point_earned), 0) AS total_points
  FROM 
    point_logs pl
  JOIN 
    projects p ON pl.projects_id = p.id
  WHERE 
    pl.user_address = user_address_input
  GROUP BY 
    p.id, p.token_address, p.token_details
  Limit limit_data;
END;
$$ LANGUAGE plpgsql;

-- Leaderboard
CREATE OR REPLACE FUNCTION leaderboard(projects_id_input UUID, limit_data NUMERIC)
RETURNS TABLE (
  user_address VARCHAR,
  total_points NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pl.user_address,
    COALESCE(SUM(pl.point_earned), 0) AS total_points
  FROM 
    point_logs pl
  WHERE 
    pl.projects_id = projects_id_input
  GROUP BY 
    pl.user_address
  ORDER BY 
    total_points DESC
  LIMIT limit_data;
END;
$$ LANGUAGE plpgsql;

-- Get Voices
CREATE OR REPLACE FUNCTION get_voice_logs_by_project(projects_id_input UUID, limit_data NUMERIC)
RETURNS TABLE (
  id UUID,
  project_id UUID,
  user_address VARCHAR,
  voice_url VARCHAR,
  is_played BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vl.id,
    vl.project_id,
    vl.user_address,
    vl.voice_url,
    vl.is_played,
    vl.created_at
  FROM 
    voice_logs vl
  WHERE 
    vl.project_id = projects_id_input
  LIMIT limit_data;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_voice_logs_by_user_address(user_address_input VARCHAR, limit_data NUMERIC)
RETURNS TABLE (
  id UUID,
  project_id UUID,
  user_address VARCHAR,
  voice_url VARCHAR,
  is_played BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vl.id,
    vl.project_id,
    vl.user_address,
    vl.voice_url,
    vl.is_played,
    vl.created_at
  FROM 
    voice_logs vl
  WHERE 
    vl.user_address = user_address_input
  LIMIT limit_data;
END;
$$ LANGUAGE plpgsql;

-- update voices to true
CREATE OR REPLACE FUNCTION update_voice_played(voice_id_input UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE voice_logs
  SET is_played = TRUE
  WHERE id = voice_id_input;
END;
$$ LANGUAGE plpgsql;

-- check if voices true
CREATE OR REPLACE FUNCTION is_voice_played(voice_id_input UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (SELECT vl.is_played 
     FROM voice_logs vl 
     WHERE vl.id = voice_id_input), 
    FALSE
  );
END;
$$ LANGUAGE plpgsql;