Vim�UnDo� ���*e�2�t�I�*����C_�����   �   W        other_user_id = match.user2_id if match.user1_id == user_id else match.user1_id   <   <                       g��E    _�                     4       ����                                                                                                                                                                                                                                                                                                                                                             g�˯     �   3   5   �      :@match_bp.route('/get_all/<int:user_id>', methods=['GET'])5��    3                     �                     5�_�                    4       ����                                                                                                                                                                                                                                                                                                                                                             g�˯     �   3   5   �      3@match_bp.route('/get_all/<int:>', methods=['GET'])5��    3                     �                     5�_�                    4       ����                                                                                                                                                                                                                                                                                                                                                             g�˱     �   3   5   �      8@match_bp.route('/get_all/<int:email>', methods=['GET'])5��    3                     �                     5�_�                    4       ����                                                                                                                                                                                                                                                                                                                                                             g�˱    �   3   5   �      5@match_bp.route('/get_all/<:email>', methods=['GET'])5��    3                     �                     5�_�                    5       ����                                                                                                                                                                                                                                                                                                                                                             g��4     �   4   6   �      def get_matches(user_id):5��    4                                          5�_�                    5       ����                                                                                                                                                                                                                                                                                                                                                             g��5     �   4   6   �      def get_matches():5��    4                                          5�_�                    6   R    ����                                                                                                                                                                                                                                                                                                                                                             g��:     �   5   7   �      a    matches = Match.query.filter((Match.user1_id == user_id) | (Match.user2_id == user_id)).all()5��    5   R                  t                     5�_�      	              6   R    ����                                                                                                                                                                                                                                                                                                                                                             g��;     �   5   7   �      Z    matches = Match.query.filter((Match.user1_id == user_id) | (Match.user2_id == )).all()5��    5   R                  t                     5�_�      
           	   6   4    ����                                                                                                                                                                                                                                                                                                                                                             g��?     �   5   7   �      _    matches = Match.query.filter((Match.user1_id == user_id) | (Match.user2_id == email)).all()5��    5   4                  V                     5�_�   	              
   6   4    ����                                                                                                                                                                                                                                                                                                                                                             g��A     �   5   7   �      X    matches = Match.query.filter((Match.user1_id == ) | (Match.user2_id == email)).all()5��    5   4                  V                     5�_�   
                 <   <    ����                                                                                                                                                                                                                                                                                                                                                             g��D     �   ;   =   �      W        other_user_id = match.user2_id if match.user1_id == user_id else match.user1_id5��    ;   <                  =                     5�_�                     <   <    ����                                                                                                                                                                                                                                                                                                                                                             g��D    �   ;   =   �      P        other_user_id = match.user2_id if match.user1_id ==  else match.user1_id5��    ;   <                  =                     5��