-- プロジェクトとその関連データを削除するRPC関数
CREATE OR REPLACE FUNCTION delete_project_with_related_data(project_id_param UUID)
RETURNS VOID AS $$
BEGIN
  -- 権限チェック: プロジェクトの所有者のみが削除可能
  IF NOT EXISTS (
    SELECT 1 FROM projects 
    WHERE id = project_id_param 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized: You can only delete your own projects';
  END IF;
  
  -- プロジェクトを削除（関連データは同じテーブル内のJSONBカラムに保存されているため、プロジェクト削除で一緒に削除される）
  DELETE FROM projects WHERE id = project_id_param AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC関数への権限付与
GRANT EXECUTE ON FUNCTION delete_project_with_related_data(UUID) TO authenticated;